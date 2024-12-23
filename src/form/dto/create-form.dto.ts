import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateFormDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @Matches(/^\+?[1-9]\d{1,14}$/)
  mobileNumber: string;

  @IsEnum(['Admission', 'Fee', 'Curriculum/Program', 'Other'])
  category: string; // Changed from query to category
}

    