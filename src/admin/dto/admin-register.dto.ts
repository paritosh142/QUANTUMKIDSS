import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class AdminRegisterDto {
  @ApiProperty({ description: 'The username of the admin' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'The password of the admin', format: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'The email of the admin' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
