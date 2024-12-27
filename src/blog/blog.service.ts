import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './schema/blog.schema';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async createBlog(blogDto: CreateBlogDto): Promise<Blog> {
    return await this.blogModel.create(blogDto);
  }

  async updateBlog(id: string, updateDto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.blogModel.findByIdAndUpdate(id, updateDto, { new: true });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async deleteBlog(id: string): Promise<void> {
    const result = await this.blogModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Blog not found');
  }

  async getAllBlogs(): Promise<Blog[]> {
    return await this.blogModel.find().sort({ createdAt: -1 });
  }

  async getBlogById(id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id);
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }
}
