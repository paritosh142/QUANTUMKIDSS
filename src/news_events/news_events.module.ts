import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEventService } from './news_events.service';
import { NewsEventsController } from './news_events.controller';
import { NewsEvent } from './schema/news_events.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewsEvent])],
  controllers: [NewsEventsController],
  providers: [NewsEventService],
  exports: [NewsEventService],
})
export class NewsEventModule {} 