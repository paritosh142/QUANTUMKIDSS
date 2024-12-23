import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from './schema/form.schema';
import { CreateFormDto } from './dto/create-form.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FormService {
  constructor(@InjectModel(Form.name) private formModel: Model<Form>) {}

  async saveForm(createFormDto: CreateFormDto): Promise<Form> {
    try {
      const newForm = new this.formModel({
        ...createFormDto,
        uuid: uuidv4(), // Ensure UUID is generated here
      });
      return newForm.save(); // This will save with the generated UUID
    } catch (error) {
      throw new Error(`Failed to save form: ${error.message}`);
    }
  }

  async getSubmissions(): Promise<Form[]> {
    return this.formModel.find().exec();
  }
}
