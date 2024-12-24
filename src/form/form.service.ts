import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from './schema/form.schema';
import { CreateFormDto } from './dto/create-form.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateFormStatusDto } from './dto/update-status.dto';
// import { getRepositoryToken } from '@nestjs/typeorm';
export interface SubmissionsResult {
  data: Form[];
  totalCount: number;
}

@Injectable()
export class FormService {
  constructor(@InjectModel(Form.name) private formModel: Model<Form>,
) {
  console.log("Your form name : " , Form.name);
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
      const newForm = new this.formModel({
        ...createFormDto,
        uuid: uuidv4(), 
        customId: this.generateCustomId(),
      });
      return newForm.save();
    } catch (error) {
      throw new Error(`Failed to save form: ${error.message}`);
    }
  }

  async getSubmissions(offset:string , pageSize:string): Promise<SubmissionsResult> {
    // return this.formModel.find().exec();
    const data = await this.formModel.aggregate([
      {
        $skip: (parseInt(offset)-1),
      },
      {
        $limit: parseInt(pageSize),
      }
    ]);
    console.log(data);
    const totalCount = await this.formModel.countDocuments().exec();  
  
    return {
      data,
      totalCount,
    };
  }
 
  async updateStatus(updateFormStatusDto: UpdateFormStatusDto): Promise<Form> {
    const { uuid, status } = updateFormStatusDto;
    return this.formModel.findOneAndUpdate({ uuid }, { status }, { new: true }).exec();
  }
  // async getSubmissionsByStatus(status: string): Promise<{ data: Form[], totalCount: number }> {
  //   const data = await this.formModel.find({ status }).exec();
  //   const totalCount = await this.formModel.countDocuments({ status }).exec();
  //   return {
  //     data,
  //     totalCount,
  //   };
  // }
  async getSubmissionsByStatus(status: string ,offset :string , pageSize :string): Promise<{ data: Form[], totalCount: number }> {
    const data = await this.formModel.find({ status })
      .skip((parseInt(offset)-1))
      .limit(parseInt(pageSize))
      .exec();
    const totalCount = await this.formModel.countDocuments({ status }).exec();
    return {
      data,
      totalCount,
    };
  }
}



