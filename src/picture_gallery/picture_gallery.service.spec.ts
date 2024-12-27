import { Test, TestingModule } from '@nestjs/testing';
import { PictureGalleryService } from './picture_gallery.service';

describe('PictureGalleryService', () => {
  let service: PictureGalleryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PictureGalleryService],
    }).compile();

    service = module.get<PictureGalleryService>(PictureGalleryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
