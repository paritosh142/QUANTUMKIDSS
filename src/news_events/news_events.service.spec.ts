import { Test, TestingModule } from '@nestjs/testing';
import { NewsEventsService } from './news_events.service';

describe('NewsEventsService', () => {
  let service: NewsEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsEventsService],
    }).compile();

    service = module.get<NewsEventsService>(NewsEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
