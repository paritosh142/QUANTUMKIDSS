import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateEmailDto {
  @ApiProperty({ description: 'The current email of the admin' })
  @IsEmail()
  @IsNotEmpty()
  currentEmail: string;

  @ApiProperty({ description: 'The new email' })
  @IsEmail()
  @IsNotEmpty()
  newEmail: string;
}
