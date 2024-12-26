import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

enum StatusEnum {
  Raw = 'raw',
  Interested = 'interested',
  Converted = 'converted',
  Pending = 'pending',
  NotInterested = 'notInterested',
  FollowUp = 'followUp'
}

export class UpdateFormStatusDto {
  @ApiProperty({
    description: 'Unique identifier for the form',
  })
  @IsUUID()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty({
    description: 'New status of the form',
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: StatusEnum;
}
