import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/add.dto';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateTeamDto } from './dto/update.dto';
import { v4 as uuidv4 } from 'uuid';
import { AddTeam } from './schema/teamAdd.schema';

export interface MemberResult {
  data: AddTeam[];
  totalCount: number;
}

@Injectable()
export class TeamAddService {
  constructor(
    @InjectRepository(AddTeam)
    private memberRepository: Repository<AddTeam>,
  ) {}

  async addMember(createMemberDto: CreateMemberDto): Promise<AddTeam> {
    try {
      const newMember = this.memberRepository.create({
        ...createMemberDto,
        uuid: uuidv4(),
      });
      return this.memberRepository.save(newMember);
    } catch (error) {
      throw new Error(`Failed to add member: ${error.message}`);
    }
  }

  async getMember(offset: string, pageSize: string): Promise<MemberResult> {
    try {
      const skip = (parseInt(offset) - 1) * parseInt(pageSize);
      const [data, totalCount] = await this.memberRepository.findAndCount({
        skip,
        take: parseInt(pageSize),
      });
      return {
        data,
        totalCount,
      };
    } catch (error) {
      throw new Error(`Failed to fetch member: ${error.message}`);
    }
  }
  async getAllMembers(): Promise<AddTeam[]> {
    return await this.memberRepository.find();
  }
  async updateMember(id: string, updateMemberDto: UpdateTeamDto): Promise<AddTeam> {
    const existingMember = await this.memberRepository.findOne({ where: { memberId: id } });

    if (!existingMember) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    Object.assign(existingMember, updateMemberDto);
    return this.memberRepository.save(existingMember);
  }

  // async deleteMember(memberId: string): Promise<AddTeam> {
  //   const existingMember = await this.memberRepository.findOne({ where: { memberId } });

  //   if (!existingMember) {
  //     throw new NotFoundException(`Member with UUID ${memberId} not found`);
  //   }

  //   return this.memberRepository.remove(existingMember);
  // }
  async findMemberId(id: string): Promise<AddTeam> {
    const member = await this.memberRepository.findOne({where:{memberId:id}});
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }
  async deleteMember(memberId: string): Promise<AddTeam> {
    const member = await this.memberRepository.findOne({where:{memberId}});
    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }

    if (member.profilePic) {
      const filePath = path.join(__dirname, '..', '..', 'uploads', member.profilePic);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
        }
      });
    }

    await this.memberRepository.remove(member);
    return member;
  }
}