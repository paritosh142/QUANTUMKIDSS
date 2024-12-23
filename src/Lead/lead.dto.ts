// // lead.dto.ts
// import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

// export class CreateLeadDto {
//   @IsNotEmpty()
//   @IsString()
//   name: string;

//   @IsNotEmpty()
//   @IsString()
//   email: string;

//   @IsNotEmpty()
//   @IsString()
//   number: string;

//   @IsNotEmpty()
//   @IsString()
//   address: string;

//   @IsNotEmpty()
//   @IsEnum(['Admission', 'Fee', 'Curriculum/Program', 'Other'])
//   queryType: string;

//   @IsEnum(['raw', 'converted', 'not_converted'])
//   status?: string;
// }

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({ description: 'Name of the lead' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email of the lead' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ description: 'Contact number of the lead' })
  @IsNotEmpty()
  @IsString()
  number: number;

  @ApiProperty({ description: 'Address of the lead' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'Type of query', enum: ['Admission', 'Fee', 'Curriculum/Program', 'Other'] })
  @IsNotEmpty()
  @IsEnum(['Admission', 'Fee', 'Curriculum/Program', 'Other'])
  queryType: string;

  @ApiProperty({ description: 'Status of the lead', enum: ['raw', 'converted', 'not_converted'], required: false })
  @IsEnum(['raw', 'converted', 'not_converted'])
  status?: string;
}
