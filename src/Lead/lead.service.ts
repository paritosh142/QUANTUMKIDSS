
// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Lead, LeadDocument } from './lead.schema';
// import { CreateLeadDto } from './lead.dto';


// @Injectable()
// export class LeadService {
//   constructor(@InjectModel(Lead.name) private leadModel: Model<LeadDocument>) {}

//   async createLead(createLeadDto: CreateLeadDto): Promise<Lead> {
//     const newLead = new this.leadModel(createLeadDto);
//     return await newLead.save();
//   }
//   async getLeads(): Promise<Lead[]> {
//     return this.leadModel.find().exec();
//   }
//   async getLeadsCount(): Promise<number> {
//     return this.leadModel.countDocuments().exec();
//   }
// }
