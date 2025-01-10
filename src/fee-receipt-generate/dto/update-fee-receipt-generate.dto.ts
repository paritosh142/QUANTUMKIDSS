import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';

export class UpdateFeeReceiptGenerateDto {
  @ApiProperty({
    description: 'Unique custom ID for the fee receipt',
  })
  @IsString()
  @IsNotEmpty()
  customId: string;

  @ApiProperty({
    description: 'Enter Unique Transition Id',
  })
  @IsString()
  @IsNotEmpty()
  transactionId:string;
      

  @ApiProperty({
    description: 'Select Payment Mode',
  })
  @IsString()
  @IsNotEmpty()
  paymentMode: string;

  @ApiProperty({
    description: 'Select Payment Mode',
  })
  @IsString()
  @IsNotEmpty()
  parentName: string;


  @ApiProperty({
    description: 'Amount of the first installment',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstInstallment?: string;

  @ApiProperty({
    description: 'Date when the first installment was made',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  firstInstallmentDate?: string;

  @ApiProperty({
    description: 'Amount of the second installment',
    required: false,
  })
  @IsString()
  @IsOptional()
  secondInstallment?: string;

  @ApiProperty({
    description: 'Date when the second installment was made',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  secondInstallmentDate?: string;

  @ApiProperty({
    description: 'Amount of the third installment',
    required: false,
  })
  @IsString()
  @IsOptional()
  thirdInstallment?: string;

  @ApiProperty({
    description: 'Date when the third installment was made',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  thirdInstallmentDate?: string;
  @ApiProperty({
    description: 'Applicant ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  applicantId?: string;

  @ApiProperty({
    description: 'First Name',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Last Name',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'installment number',
    required: false,
  })
  @IsString()
  @IsOptional()
  installmentNumber?: string;

  @ApiProperty({
    description: 'Class',
    required: false,
  })
  @IsString()
  @IsOptional()
  program?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pendingFee: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  totalYearlyPayment: string;
}
