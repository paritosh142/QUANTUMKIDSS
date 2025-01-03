import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { CreateFeeReceiptGenerateDto } from './dto/create-fee-receipt-generate.dto';
import { UpdateFeeReceiptGenerateDto } from './dto/update-fee-receipt-generate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeeReceiptGenerate } from './entities/fee-receipt-generate.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FeeReceiptGenerateService {
  constructor(
    @InjectRepository(FeeReceiptGenerate)
    private feeReceiptGenerateRepository: Repository<FeeReceiptGenerate>,
  ) {}

  async create(createFeeReceiptGenerateDto: CreateFeeReceiptGenerateDto) {
    try {
      const entity = this.feeReceiptGenerateRepository.create({
        ...createFeeReceiptGenerateDto,
        uuid: uuidv4(),
      });
      const savedEntity = await this.feeReceiptGenerateRepository.save(entity);
      return {
        data: savedEntity,
        message: 'Data inserted successfully',
      };
    } catch (error) {
      console.error('Error creating fee receipt:', error);
      throw new InternalServerErrorException(
        `Failed to create fee receipt: ${error.message}`,
      );
    }
  }

  async findAll() {
    return this.feeReceiptGenerateRepository.find();
  }

  async findOne(customId: string) {
    try {
      const entity = await this.feeReceiptGenerateRepository.findOne({
        where: { customId: customId },
      });
      if (!entity) {
        return null;
      }
      return entity;
    } catch (error) {
      console.error(`Error finding fee receipt with ID ${customId}:`, error);
      throw new InternalServerErrorException(
        `Failed to retrieve fee receipt: ${error.message}`,
      );
    }
  }

  async update(
    customId: string,
    updateFeeReceiptGenerateDto: UpdateFeeReceiptGenerateDto,
  ) {
    const feeReceipt = await this.feeReceiptGenerateRepository.findOne({ where: { customId: customId } });
    if (!feeReceipt) {
      throw new BadRequestException('Fee receipt not found');
    }
    Object.assign(feeReceipt, updateFeeReceiptGenerateDto);
    return this.feeReceiptGenerateRepository.save(feeReceipt);
  }

  async remove(customId: string) {
    try {
      const result = await this.feeReceiptGenerateRepository.delete({ customId: customId });
      if (result.affected === 0) {
        throw new NotFoundException(`Fee receipt with ID ${customId} not found.`);
      }
      return {
        message: 'Fee receipt removed successfully',
      };
    } catch (error) {
      console.error(`Error removing fee receipt with ID ${customId}:`, error);
      throw new InternalServerErrorException(
        `Failed to remove fee receipt: ${error.message}`,
      );
    }
  }

  async getReceipt(customId: string, res: Response) {
    const feeReceipt = await this.feeReceiptGenerateRepository.findOne({ where: { customId } });
    if (!feeReceipt) {
      throw new NotFoundException(`Fee receipt with ID ${customId} not found.`);
    }
  
    try {
      const doc = new PDFDocument();
      let buffers = [];
  
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        res
          .writeHead(200, {
            'Content-Length': Buffer.byteLength(pdfData),
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment;filename=receipt-${customId}.pdf`,
          })
          .end(pdfData);
      });
  
      doc.text(`Fee Receipt for ${customId}`);
      doc.text(`First Installment: ${feeReceipt.firstInstallment || 'N/A'}`);
      doc.text(`First Installment Date: ${feeReceipt.firstInstallmentDate || 'N/A'}`);
      doc.text(`Second Installment: ${feeReceipt.secondInstallment || 'N/A'}`);
      doc.text(`Second Installment Date: ${feeReceipt.secondInstallmentDate || 'N/A'}`);
      doc.text(`Third Installment: ${feeReceipt.thirdInstallment || 'N/A'}`);
      doc.text(`Third Installment Date: ${feeReceipt.thirdInstallmentDate || 'N/A'}`);
  
      doc.end();
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new InternalServerErrorException('Failed to generate PDF');
    }
  }
  
}

