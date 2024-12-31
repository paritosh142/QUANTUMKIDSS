import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class FeeSubmissionDto {

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
  mobileNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

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
}