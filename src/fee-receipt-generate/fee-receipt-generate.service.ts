import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
import { CreateFeeReceiptGenerateDto } from './dto/create-fee-receipt-generate.dto';
import { UpdateFeeReceiptGenerateDto } from './dto/update-fee-receipt-generate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeeReceiptGenerate } from './entities/fee-receipt-generate.entity';
import { v4 as uuidv4 } from 'uuid';
import { createObjectCsvStringifier } from 'csv-writer';
export interface FeeSubmit {
  data: FeeReceiptGenerate[];
  totalCount: number;
}
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

  async getReceipt(customId: string, applicantId: string, res: Response): Promise<void> {
    const feeReceipt = await this.feeReceiptGenerateRepository.findOne({ where: { customId } });
  
    if (!feeReceipt) {
      throw new NotFoundException(`Fee receipt with ID ${customId} not found.`);
    }
  
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true
      });
  
      let buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        res
          .writeHead(200, {
            'Content-Length': Buffer.byteLength(pdfData),
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment;filename=receipt-${`${feeReceipt.firstName}-${feeReceipt.lastName}`}-${applicantId}.pdf`,
          })
          .end(pdfData);
      });
  
      // Page border
      const pageWidth = doc.page.width - 2 * doc.page.margins.left;
      const pageHeight = doc.page.height - 2 * doc.page.margins.top;
      
      doc
        .rect(doc.page.margins.left - 10, doc.page.margins.top - 10,
              pageWidth + 20, pageHeight + 20)
        .stroke();
  
      // Header section
      doc
        .rect(doc.page.margins.left, doc.page.margins.top, pageWidth, 100)
        .fill('#f6f6f6');
  
      // School name
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .fillColor('#333333')
        .text('Quantum School', doc.page.margins.left, doc.page.margins.top + 20, {
          align: 'center',
          width: pageWidth
        });
  
      // Receipt title
      doc
        .fontSize(12)
        .font('Helvetica')
        .text('Fee Receipt', {
          align: 'center',
          width: pageWidth
        })
        .moveDown(1);
  
      // Generate unique receipt ID (timestamp + random string)
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
      const receiptId = `REC-${timestamp}-${randomString}`;
  
      // IDs section with better styling
      const idSectionY = doc.y;
      doc
        .rect(doc.page.margins.left, idSectionY, pageWidth, 80)
        .fill('#f9f9f9');
  
      // Display IDs in a structured layout
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#444444');
  
      // Receipt ID
      doc.text('Receipt ID:', doc.page.margins.left + 20, idSectionY + 15)
        .font('Helvetica')
        .text(receiptId, doc.page.margins.left + 120, idSectionY + 15);
  
      // Custom ID
      doc.font('Helvetica-Bold')
        .text('Custom ID:', doc.page.margins.left + 20, idSectionY + 35)
        .font('Helvetica')
        .text(customId, doc.page.margins.left + 120, idSectionY + 35);
  
      // Applicant ID
      doc.font('Helvetica-Bold')
        .text('Applicant ID:', doc.page.margins.left + 20, idSectionY + 55)
        .font('Helvetica')
        .text(applicantId, doc.page.margins.left + 120, idSectionY + 55);
  
      // Fee details table
      const startY = idSectionY + 100;
      const rowHeight = 30;
      const colWidth = pageWidth / 2;
  
      // Table headers
      doc
        .rect(doc.page.margins.left, startY, pageWidth, rowHeight)
        .fill('#e6e6e6');
  
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#333333');
  
      const tableData = [
        ['Description', 'Amount/Date'],
        ['Name', `${feeReceipt.firstName + ' ' + feeReceipt.lastName}`],
        ['Program', `${feeReceipt.program}`],
        ['Parent Name', `${feeReceipt.parentName}`],
        ['Payment Mode', `${feeReceipt.paymentMode}`],
        ['Transition Id', `${feeReceipt.transactionId}`],
        ['First Installment', `${feeReceipt.firstInstallment || 'pending'}`],
        ['First Installment Date', `${feeReceipt.firstInstallmentDate || 'N/A'}`],
        ['Second Installment', `${feeReceipt.secondInstallment || 'pending'}`],
        ['Second Installment Date', `${feeReceipt.secondInstallmentDate || 'N/A'}`],
        ['Third Installment', `${feeReceipt.thirdInstallment || 'pending'}`],
        ['Third Installment Date', `${feeReceipt.thirdInstallmentDate || 'N/A'}`],
        ['Total Yearly Payment', `${feeReceipt.totalYearlyPayment || 'N/A'}`],
        ['Pending Fee', `${feeReceipt.pendingFee || 'N/A'}`],
      ];
  
      // Draw table
      let currentY = startY;
      tableData.forEach((row, i) => {
        if (i > 0 && i % 2 === 0) {
          doc
            .rect(doc.page.margins.left, currentY, pageWidth, rowHeight)
            .fill('#f9f9f9');
        }
  
        doc
          .font(i === 0 ? 'Helvetica-Bold' : 'Helvetica')
          .fontSize(9)
          .fillColor('#333333')
          .text(row[0], doc.page.margins.left + 10, currentY + 8, {
            width: colWidth - 20
          })
          .text(row[1], doc.page.margins.left + colWidth, currentY + 8, {
            width: colWidth - 20
          });
  
        currentY += rowHeight;
      });
  
      // Table border
      doc
        .rect(doc.page.margins.left, startY, pageWidth, currentY - startY)
        .stroke();
  
      // Footer
      const footerY = doc.page.height - 100;
      doc
        .rect(doc.page.margins.left, footerY, pageWidth, 40)
        .fill('#f6f6f6');
  
      const currentDate = new Date().toLocaleDateString();
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#666666')
        .text(`Generated on: ${currentDate}`, doc.page.margins.left, footerY + 15, {
          align: 'center',
          width: pageWidth
        });
  
      // Page numbers
      // const pages = doc.bufferedPageRange();
      // for (let i = 0; i < pages.count; i++) {
      //   doc.switchToPage(i);
      //   doc
      //     .fontSize(9)
      //     .text(
      //       `Page ${i + 1} of ${pages.count}`,
      //       doc.page.margins.left,
      //       doc.page.height - 50,
      //       {
      //         align: 'center',
      //         width: pageWidth
      //       }
      //     );
      // }
  
      doc.end();
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new InternalServerErrorException('Failed to generate PDF');
    }
  }
   async getFeeDetails(): Promise<FeeSubmit> {
      const [data, totalCount] = await this.feeReceiptGenerateRepository.findAndCount();
      return {
        data,
        totalCount,
      };
    }
  
  async getFeeDetailsCsv(): Promise<string> {
      const feeDetails = await this.getFeeDetails();
  
      const csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'customId', title: 'Custom ID' },
          {id : 'applicantId', title: 'Applicant ID'},
          { id: 'firstName', title: 'First Name' },
          { id: 'lastName', title: 'Last Name' },
          {id:'class', title:'Class'},
          { id: 'firstInstallment', title: 'First Installment' },
          { id: 'secondInstallment', title: 'Second Installment' },
          { id: 'thirdInstallment', title: 'Third Installment' },
          {id:'firstInstallmentDate',title:'First Installment Status'},
          {id:'secondInstallmentDate',title:'Second Installment Status'},
          {id:'thirdInstallmentDate',title:'Third Installment Status'},
          
        ],
      });
      const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(feeDetails.data);
      return csvData;
    }
}

