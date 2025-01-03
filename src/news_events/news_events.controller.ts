import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NewsEventService } from './news_events.service';
import { CreateNewsEventDto, UpdateNewsEventDto } from './dto/news_events.dto';
import { NewsEvent } from './schema/news_events.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('NewsEvents')
@Controller('news-events')
export class NewsEventsController {
  constructor(private readonly newsEventService: NewsEventService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/news-events',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a news or event' })
  @ApiResponse({ status: 201, description: 'News/Event created successfully.' })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createNewsEventDto: CreateNewsEventDto,
  ): Promise<NewsEvent> {
    if (file) {
      createNewsEventDto.imageUrl = `/uploads/news-events/${file.filename}`;
    }
    return this.newsEventService.createNewsEvent(createNewsEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all news/events' })
  @ApiResponse({ status: 200, description: 'List of news/events.' })
  async findAll(): Promise<NewsEvent[]> {
    return this.newsEventService.getAllNewsEvents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single news/event by ID' })
  @ApiResponse({ status: 200, description: 'News/Event retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'News/Event not found.' })
  async findOne(@Param('id') id: number): Promise<NewsEvent> {
    return this.newsEventService.getNewsEventById(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/news-events',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update a news/event by ID' })
  @ApiResponse({ status: 200, description: 'News/Event updated successfully.' })
  @ApiResponse({ status: 404, description: 'News/Event not found.' })
  async update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateNewsEventDto: UpdateNewsEventDto,
  ): Promise<NewsEvent> {
    if (file) {
      updateNewsEventDto.imageUrl = `/uploads/news-events/${file.filename}`;
    }
    return this.newsEventService.updateNewsEvent(id, updateNewsEventDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a news/event by ID' })
  @ApiResponse({ status: 204, description: 'News/Event deleted successfully.' })
  @ApiResponse({ status: 404, description: 'News/Event not found.' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.newsEventService.deleteNewsEvent(id);
  }
}
