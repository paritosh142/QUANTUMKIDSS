import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePictureDto, UpdatePictureDto } from './dto/picture_gallery.dto';
import { Picture } from './schema/picture_gallery.entity';

@Injectable()
export class PictureGalleryService {
  constructor(
    @InjectRepository(Picture)
    private readonly pictureRepository: Repository<Picture>,
  ) {}

  async createPicture(dto: CreatePictureDto): Promise<Picture> {
    const picture = this.pictureRepository.create(dto);
    return this.pictureRepository.save(picture);
  }

  async updatePicture(id: number, dto: UpdatePictureDto): Promise<Picture> {
    const picture = await this.pictureRepository.preload({ id, ...dto });
    if (!picture) throw new NotFoundException('Picture not found');
    return this.pictureRepository.save(picture);
  }

  async deletePicture(id: number): Promise<void> {
    const result = await this.pictureRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Picture not found');
  }

  async getAllPictures(): Promise<Picture[]> {
    return this.pictureRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getPictureById(id: number): Promise<Picture> {
    const picture = await this.pictureRepository.findOne({ where: { id } });
    if (!picture) throw new NotFoundException('Picture not found');
    return picture;
  }
}