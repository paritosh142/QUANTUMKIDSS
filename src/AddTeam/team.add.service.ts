import { InjectModel } from '@nestjs/mongoose';
import { CreateMemberDto } from './dto/add.dto';
import { AddTeam } from './schema/teamAdd.schema';
import { Model, Types } from 'mongoose';
import { UpdateTeamDto } from './dto/update.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
export interface MemberResult {
    data: AddTeam[];
    totalCount: number;
}
export class TeamAddService {
  constructor(@InjectModel(AddTeam.name) private memberModel: Model<AddTeam>) {}

  async addMember(createMemberDto: CreateMemberDto): Promise<AddTeam> {
    try {
      const newMember = new this.memberModel({
        ...createMemberDto,
        uuid: uuidv4(), 
      });
      return newMember.save();
    } catch (error) {
      throw new Error(`Failed to add member: ${error.message}`);
    }
  }
  async getMember(offset:string , pageSize:string): Promise<MemberResult > {
    try {
    const data = await this.memberModel.aggregate([
        {
            $skip: (parseInt(offset)-1),
        },
        {
            $limit: parseInt(pageSize),
        }
    ])
        const totalCount = await this.memberModel.countDocuments().exec();
        return {
            data,
            totalCount
        }
    } catch (error) {
      throw new Error(`Failed to fetch member: ${error.message}`);
    }
  }
  async updateMember(id: string, updateMemberDto: UpdateTeamDto): Promise<AddTeam> {
    const existingMember = await this.memberModel.findByIdAndUpdate({id}, updateMemberDto, { new: true }).exec();

    if (!existingMember) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    return existingMember;
  }

  async deleteMember(memberId: string): Promise<AddTeam> {
    const existingMember = await this.memberModel.findOneAndDelete({ memberId }).exec();

    if (!existingMember) {
        throw new NotFoundException(`Member with UUID ${memberId} not found`);
    }

    return existingMember;
  }
}
