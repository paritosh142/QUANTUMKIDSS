import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateFormDto } from './dto/create-form.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateFormStatusDto } from './dto/update-status.dto';
import { Form } from './schema/form.schema';
import StudentForm from './schema/inqueryschema';
import { EnqueryFormDto } from './dto/inquery-form.dto';

export interface SubmissionsResult {
  data: Form[];
  totalCount: number;
}
export interface InqueryResult {
  data: StudentForm[];
  totalCount: number;
}
@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,
    @InjectRepository(StudentForm)
    private studentFormRepository: Repository<StudentForm>,
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

  async getSubmissions(offset: string, pageSize: string): Promise<SubmissionsResult> {
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
        // formEnqueryId: this.generateEnqueryId(),
      });
      return this.studentFormRepository.save(newForm);
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


}