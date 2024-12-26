import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'The email of the admin' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
