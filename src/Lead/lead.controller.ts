import { Controller, Post, Body, Get } from '@nestjs/common';
import { LeadService } from './lead.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Lead } from './lead.schema';
import { CreateLeadDto } from './lead.dto';

@ApiTags('leads')
@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post('/createLead')
  @ApiOperation({ summary: 'Create a new lead' })
  @ApiResponse({ status: 201, description: 'The lead has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createLead(@Body() createLeadDto: CreateLeadDto): Promise<Lead> {
    return this.leadService.createLead(createLeadDto);
  }

  @Get('/getLead')
  @ApiOperation({ summary: 'Get all leads with total count' })
  @ApiResponse({
    status: 200,
    description: 'Return all leads with total count.',
    type: Object,
  })
  async getLeads(): Promise<{ data: Lead[]; totalCount: number }> {
    const leads = await this.leadService.getLeads();  
    const totalCount = await this.leadService.getLeadsCount();  
    return { data: leads, totalCount };
  }
}