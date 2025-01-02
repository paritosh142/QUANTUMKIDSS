import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import * as fs from 'fs';
import * as path from 'path';
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/blogs',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe())
  async createBlog(
    @UploadedFile() file: Express.Multer.File,
    @Body() blogDto: CreateBlogDto,
  ) {
    if (file) {
      blogDto.imageUrl = `/uploads/blogs/${file.filename}`;
    }
    return this.blogService.createBlog(blogDto);
  }

  @Get()
  async getAllBlogs(@Req() req: Request, @Res() res: Response) {
    try {
      const blogs = await this.blogService.getAllBlogs();
      blogs.forEach(member => {
        if (member.imageUrl) {
          member.imageUrl = `${req.protocol}://${req.get('host')}${member.imageUrl}`;
        }
      });
      res.json(blogs);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch members',
        error: error.message,
      });
    }
  }

  
  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return this.blogService.getBlogById(Number(id));
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/blogs',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe())
  async updateBlog(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDto: UpdateBlogDto,
  ) {
    if (file) {
      updateDto.imageUrl = `/uploads/blogs/${file.filename}`;
    }
    return this.blogService.updateBlog(Number(id), updateDto);
  }

  @Delete(':id')
  async deleteBlog(@Param('id') id: string) {
    return this.blogService.deleteBlog(Number(id));
  }
}
