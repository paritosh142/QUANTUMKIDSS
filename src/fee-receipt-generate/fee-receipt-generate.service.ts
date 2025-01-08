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

  async getReceipt(customId: string, applicantId: string, installmentNumber: string, res: Response): Promise<void> {
    try {
        // Fetch the fee receipt details
        const feeReceipt = await this.feeReceiptGenerateRepository.findOne({ where: { customId } });

        if (!feeReceipt) {
            console.error(`Fee receipt with custom ID ${customId} not found.`);
            throw new NotFoundException(`Fee receipt with ID ${customId} not found.`);
        }

        console.log("Fee receipt fetched successfully.");

        // Store user details in variables
        const firstName = feeReceipt.firstName;
        const lastName = feeReceipt.lastName;
        const program = feeReceipt.program;

        console.log(`User details: ${firstName} ${lastName}, Program: ${program}`);

        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
            bufferPages: true,
        });

        let buffers = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res
                .writeHead(200, {
                    'Content-Length': Buffer.byteLength(pdfData),
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment;filename=receipt-${firstName}-${lastName}-${applicantId}.pdf`,
                })
                .end(pdfData);
        });

        const pageWidth = doc.page.width - 2 * doc.page.margins.left;

        // Add main border to the entire page
        doc
            .lineWidth(2)
            .strokeColor('#000000')
            .rect(doc.page.margins.left - 10, doc.page.margins.top - 10, 
                  pageWidth + 20, doc.page.height - 2 * doc.page.margins.top + 20)
            .stroke();

        const colors = {
            primary: '#8B4513',     // Saddle Brown
            secondary: '#DEB887',   // Burly Wood
            accent: '#CD853F',      // Peru
            background: '#FFF8DC',  // Cornsilk
            text: '#4A3728',        // Dark Brown
            highlight: '#FFE4B5'    // Moccasin
        };

        // Header section
        doc
            .rect(doc.page.margins.left, doc.page.margins.top, pageWidth, 120)
            .fill(colors.background);

        doc
            .lineWidth(3)
            .strokeColor(colors.accent)
            .roundedRect(doc.page.margins.left - 5, doc.page.margins.top - 5, pageWidth + 10, 130, 10)
            .stroke();

        // Contact information at top right
        const rightAlign = doc.page.width - doc.page.margins.right - 100;
        doc
            .fontSize(9)
            .font('Helvetica')
            .fillColor(colors.text)
            .text('+91 89711 33673', rightAlign, doc.page.margins.top + 10)
            .text('contact@quantumkids.in', rightAlign, doc.page.margins.top + 25)
            .text('www.quantumkids.in', rightAlign, doc.page.margins.top + 40);

        // School name and title
        doc
            .fontSize(24)
            .font('Helvetica-Bold')
            .fillColor(colors.primary)
            .text('QUANTUM KIDS', doc.page.margins.left, doc.page.margins.top + 20, 
                  { align: 'center', width: pageWidth });

        doc
            .fontSize(12)
            .font('Helvetica')
            .text('Preschool and Daycare', { align: 'center', width: pageWidth })
            .moveDown(0.5);

        doc
            .fontSize(14)
            .fillColor(colors.text)
            .text('Fee Receipt', { align: 'center', width: pageWidth })
            .moveDown(1);

        // Generate receipt ID
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        const receiptId = `REC-${timestamp}-${randomString}`;

        // Receipt Details Section - Now properly positioned after the header
        const detailsY = doc.page.margins.top + 140; // Adjusted position
        doc
            .rect(doc.page.margins.left, detailsY, pageWidth, 80)
            .fill(colors.highlight)
            .strokeColor(colors.accent)
            .stroke();

        // Receipt details content
        doc
            .fontSize(10)
            .font('Helvetica-Bold')
            .fillColor(colors.text);

        // ID Details with proper spacing
        const detailsStartY = detailsY + 15;
        doc
            .text('Receipt ID:', doc.page.margins.left + 20, detailsStartY)
            .font('Helvetica')
            .text(receiptId, doc.page.margins.left + 120, detailsStartY);

        doc
            .font('Helvetica-Bold')
            .text('Custom ID:', doc.page.margins.left + 20, detailsStartY + 20)
            .font('Helvetica')
            .text(customId, doc.page.margins.left + 120, detailsStartY + 20);

        doc
            .font('Helvetica-Bold')
            .text('Applicant ID:', doc.page.margins.left + 20, detailsStartY + 40)
            .font('Helvetica')
            .text(applicantId, doc.page.margins.left + 120, detailsStartY + 40);

        // Main Content Table - Positioned after details section
        const startY = detailsY + 100;
        const rowHeight = 25;
        const colWidth = pageWidth / 2;

        // Define table data
        const tableData = [
            ['Description', 'Amount/Date'],
            ['Name', `${firstName} ${lastName}`],
            ['Program', program],
            ['Parent Name', `${feeReceipt.parentName}`],
            ['Payment Mode', `${feeReceipt.paymentMode}`],
            ['Transaction Id', `${feeReceipt.transactionId || 'N/A'}`],
        ];

        // Add installment information based on installmentNumber
        if (installmentNumber === '1' || installmentNumber === '123') {
            tableData.push(['First Installment', `${feeReceipt.firstInstallment || 'pending'}`]);
            tableData.push(['First Installment Date', `${feeReceipt.firstInstallmentDate || 'N/A'}`]);
        }
        if (installmentNumber === '2' || installmentNumber === '23' || installmentNumber === '123') {
            tableData.push(['Second Installment', `${feeReceipt.secondInstallment || 'pending'}`]);
            tableData.push(['Second Installment Date', `${feeReceipt.secondInstallmentDate || 'N/A'}`]);
        }
        if (installmentNumber === '3' || installmentNumber === '23' || installmentNumber === '123') {
            tableData.push(['Third Installment', `${feeReceipt.thirdInstallment || 'pending'}`]);
            tableData.push(['Third Installment Date', `${feeReceipt.thirdInstallmentDate || 'N/A'}`]);
        }

        // Add total payments
        tableData.push(['Total Yearly Payment', `${feeReceipt.totalYearlyPayment || 'N/A'}`]);
        tableData.push(['Total Pending Fee', `${feeReceipt.pendingFee || 'N/A'}`]);

        // Draw table
        let currentY = startY;
        tableData.forEach((row, i) => {
          const isHeader = i === 0;
          const isEven = i % 2 === 0;
      
          // Draw row background
          if (!isHeader) {
              doc
                  .rect(doc.page.margins.left, currentY, pageWidth, rowHeight)
                  .fill(isEven ? colors.background : '#FFFFFF');
          } else {
              doc
                  .rect(doc.page.margins.left, currentY, pageWidth, rowHeight)
                  .fill(colors.secondary);
          }
      
          // Draw cell content
          doc
              .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
              .fontSize(isHeader ? 11 : 10)
              .fillColor(colors.text)
              .text(row[0], doc.page.margins.left + 10, currentY + 7, { // First column
                  width: colWidth - 20,
              })
              .text(row[1], doc.page.margins.left + colWidth + 10, currentY + 7, { // Second column with padding
                  width: colWidth - 30,
              });
      
          // Draw vertical line between columns
          doc
              .moveTo(doc.page.margins.left + colWidth, currentY)
              .lineTo(doc.page.margins.left + colWidth, currentY + rowHeight)
              .stroke();
      
          currentY += rowHeight;
      });
      

        // Draw table border
        doc
            .lineWidth(1)
            .strokeColor(colors.accent)
            .rect(doc.page.margins.left, startY, pageWidth, currentY - startY)
            .stroke();

        // Footer with address - Positioned at bottom
        const footerY = doc.page.height - 100;
        doc
            .rect(doc.page.margins.left, footerY - 10, pageWidth, 60)
            .fill(colors.background)
            .strokeColor(colors.accent)
            .stroke();

        doc
            .fontSize(8)
            .font('Helvetica')
            .fillColor(colors.text)
            .text(
                `Generated on: ${new Date().toLocaleDateString()} | Receipt ID: ${receiptId}`,
                doc.page.margins.left,
                footerY,
                { width: pageWidth, align: 'center' }
            )
            .text(
                '58, Sy No.25, Sompura Village, Sarjapura Hobil, Anekal Taluk, Bangalore-562125',
                doc.page.margins.left,
                footerY + 20,
                { width: pageWidth, align: 'center' }
            )
            .text(
                'Landmark: Next To ARS SIGNATURE PHASE 2',
                doc.page.margins.left,
                footerY + 35,
                { width: pageWidth, align: 'center' }
            );

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

