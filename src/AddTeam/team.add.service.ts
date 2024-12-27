import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/add.dto';

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

  async updateMember(id: string, updateMemberDto: UpdateTeamDto): Promise<AddTeam> {
    const existingMember = await this.memberRepository.findOne({ where: { memberId: id } });

    if (!existingMember) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    Object.assign(existingMember, updateMemberDto);
    return this.memberRepository.save(existingMember);
  }

  async deleteMember(memberId: string): Promise<AddTeam> {
    const existingMember = await this.memberRepository.findOne({ where: { memberId } });

    if (!existingMember) {
      throw new NotFoundException(`Member with UUID ${memberId} not found`);
    }

    return this.memberRepository.remove(existingMember);
  }
}