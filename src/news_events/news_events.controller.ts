import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, UseInterceptors, UsePipes, ValidationPipe, UploadedFiles, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { NewsEventService } from './news_events.service';
import { CreateNewsEventDto, UpdateNewsEventDto } from './dto/news_events.dto';
import { NewsEvent } from './schema/news_events.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('NewsEvents')
@Controller('news-events')
export class NewsEventsController {
  constructor(private readonly newsEventService: NewsEventService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, { // Allow up to 10 images
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
  @ApiConsumes('multipart/form-data')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a news or event with multiple images' })
  @ApiResponse({ status: 201, description: 'News/Event created successfully.' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createNewsEventDto: CreateNewsEventDto,
  ): Promise<NewsEvent> {
    if (files && files.length > 0) {
      createNewsEventDto.imageUrls = files.map(
        file => `/uploads/news-events/${file.filename}`,
      );
    }
    return this.newsEventService.createNewsEvent(createNewsEventDto);
  }

  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
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
  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
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
  @ApiConsumes('multipart/form-data')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Partially update a news/event by ID' })
  @ApiResponse({ status: 200, description: 'News/Event updated successfully.' })
  @ApiResponse({ status: 404, description: 'News/Event not found.' })
  async patch(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateNewsEventDto: Partial<UpdateNewsEventDto>,
  ): Promise<NewsEvent> {
    if (files && files.length > 0) {
      updateNewsEventDto.imageUrls = files.map(
        (file) => `/uploads/news-events/${file.filename}`,
      );
    }
    return this.newsEventService.updateNewsEvent(id, updateNewsEventDto);
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

  

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a news/event by ID' })
  @ApiResponse({ status: 204, description: 'News/Event deleted successfully.' })
  @ApiResponse({ status: 404, description: 'News/Event not found.' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.newsEventService.deleteNewsEvent(id);
  }
}
