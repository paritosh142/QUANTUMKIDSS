import { Module } from '@nestjs/common';
import { PictureGalleryService } from './picture_gallery.service';
import { PictureGalleryController } from './picture_gallery.controller';
import { Picture } from './schema/picture_gallery.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Picture])],
  controllers: [PictureGalleryController],
  providers: [PictureGalleryService],
  exports: [PictureGalleryService],
})
export class PictureGalleryModule {}
