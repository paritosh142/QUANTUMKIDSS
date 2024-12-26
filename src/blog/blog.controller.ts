import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async createBlog(@Body() blogDto: CreateBlogDto) {
    return this.blogService.createBlog(blogDto);
  }

  @Patch(':id')
  async updateBlog(@Param('id') id: string, @Body() updateDto: UpdateBlogDto) {
    return this.blogService.updateBlog(id, updateDto);
  }

  @Delete(':id')
  async deleteBlog(@Param('id') id: string) {
    return this.blogService.deleteBlog(id);
  }

  @Get()
  async getAllBlogs() {
    return this.blogService.getAllBlogs();
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return this.blogService.getBlogById(id);
  }
}
