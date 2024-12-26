import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateTeamDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
     memberName?: string;
    
     @ApiProperty()
    @IsString()
    @IsOptional()
     memberRole?: string;
  
     @ApiProperty()
    @IsString()
    @IsOptional()
     memberEmail?: string;
  
     @ApiProperty()
    @IsString()
    @IsOptional()
     memberMobile?: string;
  
     @ApiProperty()
    @IsString()
    @IsOptional()
    memberId?: string;
  
     @ApiProperty()
    @IsString()
    @IsOptional()
     memberDesination?: string;
  
     @ApiProperty()
    @IsString()
    @IsOptional()
     profilePic?: string;
}