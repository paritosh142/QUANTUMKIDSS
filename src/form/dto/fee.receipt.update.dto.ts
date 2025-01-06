import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsMobilePhone, IsNotEmpty } from 'class-validator';

export class FeeReceiptUpdateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  class: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsMobilePhone()
  @IsNotEmpty()
  mobileNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  totalYearlyPayment: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstInstallment: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  secondInstallment: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  thirdInstallment: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicantId: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pendingFee: string;
}
