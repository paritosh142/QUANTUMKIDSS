import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEvent } from './schema/news_events.entity';
import { CreateNewsEventDto, UpdateNewsEventDto } from './dto/news_events.dto';

@Injectable()
export class NewsEventService {
  constructor(
    @InjectRepository(NewsEvent)
    private readonly newsEventRepository: Repository<NewsEvent>,
  ) {}

  async createNewsEvent(dto: CreateNewsEventDto): Promise<NewsEvent> {
    const newsEvent = this.newsEventRepository.create(dto);
    if (dto.imageUrl) {
      newsEvent.imageUrl = dto.imageUrl;
    }
    return this.newsEventRepository.save(newsEvent);
  }

  async updateNewsEvent(id: number, dto: UpdateNewsEventDto): Promise<NewsEvent> {
    const newsEvent = await this.newsEventRepository.preload({ id, ...dto });
    if (!newsEvent) throw new NotFoundException('News/Event not found');
    if (dto.imageUrl) {
      newsEvent.imageUrl = dto.imageUrl;
    }
    return this.newsEventRepository.save(newsEvent);
  }

  async deleteNewsEvent(id: number): Promise<void> {
    const result = await this.newsEventRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('News/Event not found');
  }

  async getAllNewsEvents(): Promise<NewsEvent[]> {
    return this.newsEventRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getNewsEventById(id: number): Promise<NewsEvent> {
    const newsEvent = await this.newsEventRepository.findOne({ where: { id } });
    if (!newsEvent) throw new NotFoundException('News/Event not found');
    return newsEvent;
  }
}