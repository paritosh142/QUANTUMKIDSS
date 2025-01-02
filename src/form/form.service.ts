import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createObjectCsvStringifier } from 'csv-writer';

import { CreateFormDto } from './dto/create-form.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateFormStatusDto } from './dto/update-status.dto';
import { Form } from './schema/form.schema';
import StudentForm from './schema/inqueryschema';
import { EnqueryFormDto } from './dto/inquery-form.dto';
import FeeManagement from './schema/feeManagement';
import { FeeSubmissionDto } from './dto/fee-submit.dto';

export interface SubmissionsResult {
  data: Form[];
  totalCount: number;
}
export interface InqueryResult {
  data: StudentForm[];
  totalCount: number;
}

export interface FeeSubmit {
  data: FeeManagement[];
  totalCount: number;
}
@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,
    @InjectRepository(StudentForm)
    private studentFormRepository: Repository<StudentForm>,
    @InjectRepository(FeeManagement)
    private feeRepository: Repository<FeeManagement>,
  ) {
    console.log("Your form name : ", Form.name);
  }

  private generateCustomId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'QK-';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async saveForm(createFormDto: CreateFormDto): Promise<Form> {
    try {
      const newForm = this.formRepository.create({
        ...createFormDto,
        uuid: uuidv4(),
        customId: this.generateCustomId(),
      });
      return this.formRepository.save(newForm);
    } catch (error) {
      throw new Error(`Failed to save form: ${error.message}`);
    }
  }

  async getSubmissions(): Promise<SubmissionsResult> {
    // const skip = (parseInt(offset) - 1) * parseInt(pageSize);
    const [data, totalCount] = await this.formRepository.findAndCount();
    return {
      data,
      totalCount,
    };
  }

  async updateStatus(updateFormStatusDto: UpdateFormStatusDto): Promise<Form> {
    const { uuid, status } = updateFormStatusDto;
    const form = await this.formRepository.findOneBy({ uuid });
    if (!form) {
      throw new BadRequestException('Form not found');
    }
    form.status = status;
    return this.formRepository.save(form);
  }

  async getSubmissionsByStatus(status: string, offset: string, pageSize: string): Promise<SubmissionsResult> {
    // const skip = (parseInt(offset) - 1) * parseInt(pageSize);
    const [data, totalCount] = await this.formRepository.findAndCount({
      where: { status },
    });
    return {
      data,
      totalCount,
    };
  }

  async getCount(status: string): Promise<number> {
    return this.formRepository.count({ where: { status } });
  }
  async saveInqueryForm(enqueryFormDto: EnqueryFormDto): Promise<StudentForm> {
    try {
      const newForm = this.studentFormRepository.create({
        ...enqueryFormDto,
        uuid: uuidv4(),
      });

      const saveIn = this.feeRepository.create({
        ...enqueryFormDto,
        uuid: uuidv4(),
      });

      await this.feeRepository.save(saveIn);
      return await this.studentFormRepository.save(newForm);
    } catch (error) {
      throw new Error(`Failed to save form: ${error.message}`);
    }
  }

  async getInqueryForm(): Promise<InqueryResult> {
    // const skip = (parseInt(offset) - 1) * parseInt(pageSize);
    const [data, totalCount] = await this.studentFormRepository.findAndCount();
    return {
      data,
      totalCount,
    };
  }

  async getInqueryFormBycustomId(customId:string): Promise<boolean> {
   
    const [,count] = await this.studentFormRepository.findAndCount({
      where: { customId },
    });
    return count>0;
  }

  async saveFee(feeData: FeeSubmissionDto): Promise<FeeManagement> {
    try {
      const newFee = this.feeRepository.create({
        ...feeData,
        uuid: uuidv4(),
      });
      const savedFee = await this.feeRepository.save(newFee);
      return savedFee;
    } catch (error) {
      throw new Error(`Failed to save fee: ${error.message}`);
    }
  }

  async getFeeDetails(): Promise<FeeSubmit> {
    const [data, totalCount] = await this.feeRepository.findAndCount();
    return {
      data,
      totalCount,
    };
  }

  async updateFeeData(uuid: string, feeSubmissionDto: FeeSubmissionDto): Promise<FeeManagement> {
    const fee = await this.feeRepository.findOne({ where: { uuid } });
    
    if (!fee) {
      throw new BadRequestException('Fee not found');
    }
    Object.assign(fee, feeSubmissionDto);
    return this.feeRepository.save(fee);
  }
  async getFeeDetailsCsv(): Promise<string> {
    const feeDetails = await this.getFeeDetails();

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'customId', title: 'Custom ID' },
        { id: 'firstName', title: 'First Name' },
        { id: 'lastName', title: 'Last Name' },
        { id: 'email', title: 'Email' },
        { id: 'mobileNumber', title: 'Mobile Number' },
        { id: 'firstInstallment', title: 'First Installment' },
        { id: 'secondInstallment', title: 'Second Installment' },
        { id: 'thirdInstallment', title: 'Third Installment' },
        {id:'firstInstallmentStatus',title:'First Installment Status'},
        {id:'secondInstallmentStatus',title:'Second Installment Status'},
        {id:'thirdInstallmentStatus',title:'Third Installment Status'},
        
      ],
    });
    const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(feeDetails.data);
    return csvData;
  }

  async getLeadDetailsCsv(): Promise<string> {
    const leadDetails = await this.getSubmissions();

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'customId', title: 'Custom ID' },
        { id: 'firstName', title: 'First Name' },
        { id: 'lastName', title: 'Last Name' },
        { id: 'email', title: 'Email' },
        { id: 'address', title: 'Address' },
        { id: 'mobileNumber', title: 'Mobile Number' },
        { id: 'category', title: 'Category' },
        { id: 'submittedAt', title: 'submitted At' },
        { id: 'status', title: 'Status' },
      ],
    });
    const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(leadDetails.data);
    return csvData;
  }
  
}