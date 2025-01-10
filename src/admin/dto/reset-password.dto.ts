import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'The current password', format: 'password' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ description: 'The reset token' })
  @IsString()
  @IsOptional()
  token: string;

  @ApiProperty({ description: 'The reset token' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'The new password', format: 'password' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
