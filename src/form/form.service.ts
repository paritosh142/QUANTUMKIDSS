import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateFormDto } from './dto/create-form.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateFormStatusDto } from './dto/update-status.dto';
import { Form } from './schema/form.schema';

export interface SubmissionsResult {
  data: Form[];
  totalCount: number;
}

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,
  ) {
    console.log("Your form name : ", Form.name);
  }

  private generateCustomId(): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'QUA-';
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
    const skip = (parseInt(offset) - 1) * parseInt(pageSize);
    const [data, totalCount] = await this.formRepository.findAndCount({
      skip,
      take: parseInt(pageSize),
    });
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
    const skip = (parseInt(offset) - 1) * parseInt(pageSize);
    const [data, totalCount] = await this.formRepository.findAndCount({
      where: { status },
      skip,
      take: parseInt(pageSize),
    });
    return {
      data,
      totalCount,
    };
  }

  async getCount(status: string): Promise<number> {
    return this.formRepository.count({ where: { status } });
  }
}