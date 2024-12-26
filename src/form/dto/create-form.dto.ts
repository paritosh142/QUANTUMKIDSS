import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateFormDto {
  @ApiProperty({
    description: 'First name of the lead',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the lead',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Email address of the lead',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Residential address of the lead',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Mobile number in E.164 format',
  })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Mobile number must be in valid E.164 format.',
  })
  @IsNotEmpty()
  mobileNumber: string;

  @ApiProperty({
    description: 'Category of the inquiry',
    enum: ['Admission', 'Fee', 'Curriculum/Program', 'Other'],
  })
  @IsEnum(['Admission', 'Fee', 'Curriculum/Program', 'Other'])
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'Current status or type of the lead',
    enum: ['raw', 'interested', 'converted', 'pending', 'notInterested','followUp'],
    default: 'raw',
  })
  @IsEnum(['raw', 'interested', 'converted', 'pending', 'notInterested','followUp'])
  @IsNotEmpty()
  type: string = 'raw';
}
