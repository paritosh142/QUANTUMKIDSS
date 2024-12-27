import { Test, TestingModule } from '@nestjs/testing';
import { PictureGalleryController } from './picture_gallery.controller';

describe('PictureGalleryController', () => {
  let controller: PictureGalleryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PictureGalleryController],
    }).compile();

    controller = module.get<PictureGalleryController>(PictureGalleryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
