import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString ,IsOptional } from "class-validator";


export class CreateMemberDto{

    uuid?: string;
    @ApiProperty({description:"Name of the member"})
    @IsString()
    @IsNotEmpty()
    memberName: string;
    
    @ApiProperty({description:"Role of the member"})
    @IsNotEmpty()
    @IsString()
    memberRole: string;

    @ApiProperty({description:"Email of the member"})
    @IsNotEmpty()
    @IsString()
    memberEmail: string;

    @ApiProperty({description:"Mobile of the member"})
    @IsNotEmpty()
    @IsString()
    memberMobile: string;

    @ApiProperty({description:"Team ID of the member"})
    @IsNotEmpty()
    @IsString()
    memberId: string;

    @ApiProperty({description:"Designation of the member"})
    @IsNotEmpty()
    @IsString()
    memberDesination: string;

    @ApiProperty({description:"Designation of the member"})
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({description:"Designation of the member"})
    @IsNotEmpty()
    @IsString()
    order: string;

    @ApiProperty({description:"Profile Picture of the member"})
    @IsString()
    @IsOptional()
    profilePic?: string;
}