import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateNewsEventDto {
  @ApiProperty({ description: 'The title of the news/event' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The description of the news/event' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The URL of the image', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'The date of the event', required: false })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  eventDate?: Date;
}

export class UpdateNewsEventDto {
  @ApiProperty({ description: 'The title of the news/event', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'The description of the news/event', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The URL of the image', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'The date of the event', required: false })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  eventDate?: Date;
}