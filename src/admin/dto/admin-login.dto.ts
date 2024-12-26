import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ description: 'The username of the admin' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'The password of the admin', format: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
