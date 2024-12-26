import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUsernameDto {
  @ApiProperty({ description: 'The current username of the admin' })
  @IsString()
  @IsNotEmpty()
  currentUsername: string;

  @ApiProperty({ description: 'The new username' })
  @IsString()
  @IsNotEmpty()
  newUsername: string;
}
