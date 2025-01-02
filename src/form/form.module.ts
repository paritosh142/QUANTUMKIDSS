import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { Form } from './schema/form.schema';
import StudentForm from './schema/inqueryschema';
import FeeManagement from './schema/feeManagement';
import { FeeReceiptSchema } from './schema/Fee.receipt.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Form, StudentForm,FeeManagement,FeeReceiptSchema]),
  ],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}