import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class CreatePictureDto {
  @ApiProperty({ description: 'The title of the picture' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The image of the picture', required: false })
  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdatePictureDto {
  @ApiProperty({ description: 'The title of the picture', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'The image of the picture', required: false })
  @IsString()
  @IsOptional()
  image?: string;
}