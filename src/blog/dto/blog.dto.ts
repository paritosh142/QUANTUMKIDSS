import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ description: 'The title of the blog' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The content of the blog' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'The author of the blog' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ description: 'A brief summary of the blog' })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({ description: 'The URL of the blog image' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'Tags related to the blog', type: [String] })
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}


export class UpdateBlogDto {
  @ApiProperty({ description: 'The title of the blog', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'The content of the blog', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: 'The author of the blog', required: false })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({ description: 'A brief summary of the blog', required: false })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({ description: 'The URL of the blog image', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'Tags related to the blog', type: [String], required: false })
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
