import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePictureDto {
  @ApiProperty({ description: 'The title of the picture' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The URL of the image' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}

export class UpdatePictureDto {
  @ApiProperty({ description: 'The title of the picture', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'The URL of the image', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}