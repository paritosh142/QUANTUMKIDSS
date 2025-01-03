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
} from '@nestjs/common';
import { Response } from 'express';
import { FeeReceiptGenerateService } from './fee-receipt-generate.service';
import { CreateFeeReceiptGenerateDto } from './dto/create-fee-receipt-generate.dto';
import { UpdateFeeReceiptGenerateDto } from './dto/update-fee-receipt-generate.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  async getReceipt(@Query('customId') customId: string, @Res() res: Response) {
    const response=  this.feeReceiptGenerateService.getReceipt(customId, res);
    if(response){
      return response;
    }

  }
  
}