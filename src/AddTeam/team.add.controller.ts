import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { TeamAddService } from './team.add.service';
import { CreateMemberDto } from './dto/add.dto';
import { UpdateTeamDto } from './dto/update.dto';

@Controller('team')
export class TeamAddController {
  constructor(private readonly teamService: TeamAddService) {}

  @Post('add')
  @UsePipes(new ValidationPipe())
  async addTeam(@Body() createMemberDto: CreateMemberDto) {
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
  @Patch('edit/:id')
  @UsePipes(new ValidationPipe())
  async updateMember(@Param('id') id: string, @Body() updateMemberDto: UpdateTeamDto) {
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
