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
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { PictureGalleryService } from './picture_gallery.service';
import { CreatePictureDto, UpdatePictureDto } from './dto/picture_gallery.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { existsSync, mkdirSync } from 'fs';

@ApiTags('Picture Gallery')
@Controller('picture-gallery')
export class PictureGalleryController {
  constructor(private readonly pictureGalleryService: PictureGalleryService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/pictures';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new picture' })
  @ApiResponse({ status: 201, description: 'Picture created successfully.' })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPictureDto: CreatePictureDto,
  ) {
    if (file) {
      createPictureDto.image = `/uploads/pictures/${file.filename}`;
    }
    const picture = await this.pictureGalleryService.createPicture(createPictureDto);
    return {
      ...picture,
      image: picture.image
        ? `${process.env.BASE_URL || 'http://localhost:3002'}${picture.image}`
        : null,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all pictures' })
  @ApiResponse({ status: 200, description: 'List of pictures.' })
  async findAll() {
    const pictures = await this.pictureGalleryService.getAllPictures();
    return pictures.map((picture) => ({
      ...picture,
      image: picture.image
        ? `${process.env.BASE_URL || 'http://localhost:3002'}${picture.image}`
        : null,
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single picture by ID' })
  @ApiResponse({ status: 200, description: 'Picture retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Picture not found.' })
  async findOne(@Param('id') id: number) {
    const picture = await this.pictureGalleryService.getPictureById(id);
    return {
      ...picture,
      image: picture.image
        ? `${process.env.BASE_URL || 'http://localhost:3002'}${picture.image}`
        : null,
    };
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/pictures';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update a picture by ID' })
  @ApiResponse({ status: 200, description: 'Picture updated successfully.' })
  async update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updatePictureDto: UpdatePictureDto,
  ) {
    if (file) {
      updatePictureDto.image = `/uploads/pictures/${file.filename}`;
    }
    const picture = await this.pictureGalleryService.updatePicture(id, updatePictureDto);
    return {
      ...picture,
      image: picture.image
        ? `${process.env.BASE_URL || 'http://localhost:3002'}${picture.image}`
        : null,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a picture by ID' })
  @ApiResponse({ status: 204, description: 'Picture deleted successfully.' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.pictureGalleryService.deletePicture(id);
  }
}
