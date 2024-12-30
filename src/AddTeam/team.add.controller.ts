import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { extname } from 'path';
import { TeamAddService } from './team.add.service';
import { CreateMemberDto } from './dto/add.dto';
import { UpdateTeamDto } from './dto/update.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('team')
export class TeamAddController {
  constructor(private readonly teamService: TeamAddService) {}

  // @Post('add')
  // @UsePipes(new ValidationPipe())
  // async addTeam(@Body() createMemberDto: CreateMemberDto) {
  //   try {
  //     const result = await this.teamService.addMember(createMemberDto);
  //     return {
  //       message: 'Member added successfully!',
  //       uuid: result.uuid,
  //       data: result,
  //     };
  //   } catch (error) {
  //     return {
  //       message: 'Failed to add member',
  //       error: error.message,
  //     };
  //   }
  // }
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('profilePic', {
  //   storage: diskStorage({
  //     destination: './uploads',
  //     filename: (req, file, cb) => {
  //       const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
  //       cb(null, `${randomName}${extname(file.originalname)}`);
  //     },
  //   }),
  // }))
  // async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() createMemberDto: CreateMemberDto) {
  //   createMemberDto.profilePic = file.filename;
  //   return this.teamService.addMember(createMemberDto);
  // }
  @Post('add')
  @ApiOperation({ summary: 'Grt all Data' })
  @ApiResponse({ status: 200, description: 'Member Added succesfully!' })
  @ApiResponse({ status: 500, description: 'Failed to add member' })
  @UseInterceptors(FileInterceptor('profilePic', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  @UsePipes(new ValidationPipe())
  async addMember(@UploadedFile() file: Express.Multer.File, @Body() createMemberDto: CreateMemberDto) {
    if (file) {
      createMemberDto.profilePic = file.filename;
    }
    try {
      const result = await this.teamService.addMember(createMemberDto);
      return {
        message: 'Member added successfully!',
        uuid: result.uuid,
        data: result,
      };
    } catch (error) {
      return {
        message: 'Failed to add member',
        error: error.message,
      };
    }
  }
  @Get('member/:id')
  async getMember(@Param('id') id: string) {
    try {
      const result = await this.teamService.findMemberId(id);
      return {
        message: 'Member fetched successfully!',
        data: result,
      };
    } catch (error) {
      return {
        message: 'Failed to fetch member',
        error: error.message,
      };
    }
  }
  @Get('get')
  async getTeam(
    @Query('offset')offset: string,
    @Query('pageSize') pageSize: string,
  ) {
    try {
      const result = await this.teamService.getMember(offset, pageSize);
      return {
        message: 'Member fetched successfully!',
        data: result,
      };
    } catch (error) {
      return {  
        message: 'Failed to fetch member',
        error: error.message,
      };
    }
  }
  // @Get(':id')
  // async getMember(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
  //   const member = await this.teamService.getMemberById(id);
  //   if (member.profilePic) {
  //     member.profilePic = `${req.protocol}://${req.get('host')}/uploads/${member.profilePic}`;
  //   }
  //   res.json(member);
  // }
  @Get()
  async getAllMembers(@Req() req: Request, @Res() res: Response) {
    try {
      const members = await this.teamService.getAllMembers();
      members.forEach(member => {
        if (member.profilePic) {
          member.profilePic = `${req.protocol}://${req.get('host')}/uploads/${member.profilePic}`;
        }
      });
      res.json(members);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch members',
        error: error.message,
      });
    }
  }
  @Patch('edit/:id')
  @UseInterceptors(FileInterceptor('profilePic', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  @UsePipes(new ValidationPipe())
  async updateMember(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() updateMemberDto: UpdateTeamDto) {
    if (file) {
      updateMemberDto.profilePic = file.filename;
    }
    try {
      const result = await this.teamService.updateMember(id, updateMemberDto);
      return {
        message: 'Member updated successfully!',
        data: result,
      };
    } catch (error) {
      return {
        message: 'Failed to update member',
        error: error.message,
      };
    }
  }
  @Delete('delete')
  @UsePipes(new ValidationPipe())
  async deleteMember(@Body('memberId') memberIdFromBody: string, @Query('memberId') memberIdFromQuery: string) {
    try {
      const memberId = memberIdFromBody || memberIdFromQuery;
      if (!memberId) {
        throw new Error('Member ID is required');
      }
      const result = await this.teamService.deleteMember(memberId);
      return {
        message: 'Member deleted successfully!',
        data: result,
      };
    } catch (error) {
      return {
        message: 'Failed to delete member',
        error: error.message,
      };
    }
  }
}
