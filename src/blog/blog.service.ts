import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './schema/blog.schema';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async createBlog(blogDto: CreateBlogDto): Promise<Blog> {
    const blog = this.blogRepository.create(blogDto);
    return this.blogRepository.save(blog);
  }

  async updateBlog(id: number, updateDto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.blogRepository.preload({ id, ...updateDto });
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return this.blogRepository.save(blog);
  }

  async deleteBlog(id: number): Promise<void> {
    const result = await this.blogRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
  }

  async getAllBlogs(): Promise<Blog[]> {
    return this.blogRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getBlogById(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return blog;
  }
}
