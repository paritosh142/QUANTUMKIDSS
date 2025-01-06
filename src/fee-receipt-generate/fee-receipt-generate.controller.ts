import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { FeeReceiptGenerateService } from './fee-receipt-generate.service';
import { CreateFeeReceiptGenerateDto } from './dto/create-fee-receipt-generate.dto';
import { UpdateFeeReceiptGenerateDto } from './dto/update-fee-receipt-generate.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FeeReceiptGenerate } from './entities/fee-receipt-generate.entity';
export interface FeeSubmit {
  data: FeeReceiptGenerate[];
  totalCount: number;
}
@Controller('fee-receipt-generate')
export class FeeReceiptGenerateController {
  constructor(private readonly feeReceiptGenerateService: FeeReceiptGenerateService) {}

  @Post()
  async create(@Body() createFeeReceiptGenerateDto: CreateFeeReceiptGenerateDto) {
    return this.feeReceiptGenerateService.create(createFeeReceiptGenerateDto);
  }

  @Get()
  async findAll() {
    return this.feeReceiptGenerateService.findAll();
  }

  @Get('byId')
  async findOne(@Query('customId') customId: string) {
    const result = await this.feeReceiptGenerateService.findOne(customId);
    if (!result) {
      throw new NotFoundException(`Fee receipt with ID ${customId} not found.`);
    }
    return result;
  }

  @Patch()
  async update(
    @Query('customId') customId: string,
    @Body() updateFeeReceiptGenerateDto: UpdateFeeReceiptGenerateDto,
  ) {
    const existingRecord = await this.feeReceiptGenerateService.findOne(customId);
    if (!existingRecord) {
      throw new NotFoundException(`Fee receipt with ID ${customId} not found.`);
    }
    return await this.feeReceiptGenerateService.update(customId, updateFeeReceiptGenerateDto);
  }

  @Delete()
  async remove(@Query('customId') customId: string) {
    const existingRecord = await this.feeReceiptGenerateService.findOne(customId);
    if (!existingRecord) {
      throw new NotFoundException(`Fee receipt with ID ${customId} not found.`);
    }
    return this.feeReceiptGenerateService.remove(customId);
  }

  @Get('getReceipt')
  @ApiOperation({ summary: 'Get Fee Receipt as PDF' })
  @ApiResponse({ status: 200, description: 'PDF file generated successfully!' })
  async getReceipt( @Query('customId') customId: string,
  @Query('applicantId') applicantId: string, @Res() res: Response) {
    try {
      await this.feeReceiptGenerateService.getReceipt(customId,applicantId, res);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to generate PDF');
      }
    }
  }
  @Get('fee/details/csv')
  @ApiOperation({ summary: 'Get Fee Details as CSV' })
  @ApiResponse({ status: 200, description: 'CSV file generated successfully!' })
  async getFeeDetailsCsv(@Res() res: Response) {
    const csvData = await this.feeReceiptGenerateService.getFeeDetailsCsv();
    res.header('Content-Type', 'text/csv');
    res.attachment('fee-details.csv');
    res.send(csvData);
  }
}