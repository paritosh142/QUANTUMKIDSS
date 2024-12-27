import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PictureGalleryService } from './picture_gallery.service';
import { CreatePictureDto, UpdatePictureDto } from './dto/picture_gallery.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Picture Gallery')
@Controller('picture-gallery')
export class PictureGalleryController {
  constructor(private readonly pictureGalleryService: PictureGalleryService) {}

  @ApiOperation({ summary: 'Create a new picture' })
  @Post()
  createPicture(@Body() dto: CreatePictureDto) {
    return this.pictureGalleryService.createPicture(dto);
  }

  @ApiOperation({ summary: 'Get all pictures' })
  @Get()
  getAllPictures() {
    return this.pictureGalleryService.getAllPictures();
  }

  @ApiOperation({ summary: 'Get a picture by ID' })
  @Get(':id')
  getPictureById(@Param('id', ParseIntPipe) id: number) {
    return this.pictureGalleryService.getPictureById(id);
  }

  @ApiOperation({ summary: 'Update a picture' })
  @Patch(':id')
  updatePicture(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePictureDto) {
    return this.pictureGalleryService.updatePicture(id, dto);
  }

  @ApiOperation({ summary: 'Delete a picture' })
  @Delete(':id')
  deletePicture(@Param('id', ParseIntPipe) id: number) {
    return this.pictureGalleryService.deletePicture(id);
  }
}
