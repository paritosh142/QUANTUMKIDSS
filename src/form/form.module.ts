import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { Form } from './schema/form.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Form]),
  ],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}