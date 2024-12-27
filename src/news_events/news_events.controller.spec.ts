import { Test, TestingModule } from '@nestjs/testing';
import { NewsEventsController } from './news_events.controller';

describe('NewsEventsController', () => {
  let controller: NewsEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsEventsController],
    }).compile();

    controller = module.get<NewsEventsController>(NewsEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
