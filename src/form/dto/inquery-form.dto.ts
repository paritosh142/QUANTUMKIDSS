import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EnqueryFormDto {
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
  addmissionYear: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  primaryContactName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mobileNumber: string;



  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  program: string;

}
