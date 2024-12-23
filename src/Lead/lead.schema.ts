import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
export type LeadDocument = Lead & Document;

@Schema()
export class Lead {
  @Prop({ default: uuidv4 })
  LeadNumber: string;
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  number: number;

  @Prop({ required: true })
  address: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({
    required: false,
    enum: ['Admission', 'Fee', 'Curriculum/Program', 'Other'],
  })
  queryType: string;

  @Prop({
    enum: ['raw', 'converted', 'not_converted'],
    default: 'raw',
  })
  status: string;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
