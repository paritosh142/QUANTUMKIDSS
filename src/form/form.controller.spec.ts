import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Form extends Document {
  @Prop({ required: true, unique: true })
  uuid: string; 
  
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true  })
  lastName: string;

  @Prop({ required: true, unique: true, match: /^\S+@\S+\.\S+$/ })
  email: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true,unique: true, match: /^\+?[1-9]\d{1,14}$/ })
  mobileNumber: string;

  @Prop({ required: true, enum: ['Admission', 'Fee', 'Curriculum/Program', 'Other'] })
  category: string;

  @Prop({ default: Date.now })
  submittedAt: Date;
  @Prop({ required: true, unique: true })
  customId: string; 
  @Prop({
    enum: ['raw', 'interested','FollowUp', ' visitScheduled','converted', 'notInterested','followUp'],
    default: 'raw', 
  })
  status: string;
  
}

export const FormSchema = SchemaFactory.createForClass(Form);
