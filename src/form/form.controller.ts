import { Body, Controller, Get, Patch, Post, Put, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateFormStatusDto } from './dto/update-status.dto';
import { Form } from './schema/form.schema';
import { EnqueryFormDto } from './dto/inquery-form.dto';
import { FeeSubmissionDto } from './dto/fee-submit.dto';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post('submit')
  @UsePipes(new ValidationPipe())
  async submitForm(@Body() createFormDto: CreateFormDto) {
    try {
      const result = await this.formService.saveForm(createFormDto);
      return {
        message: 'Form submitted successfully!',
        uuid: result.uuid,
        customId:result.customId,
        data: result,
      };
    } catch (error) {
      return {
        message: 'Failed to submit form',
        error: error.message,
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Grt all Data' })
  @ApiResponse({ status: 200, description: 'Form Data retrieved successfully!' })
  async getAllForms(
  ) {
    return {
      message: 'Form submissions retrieved successfully!',
      data: await this.formService.getSubmissions(),
    };
  }
  // @Get('status')
  // // @ApiOperation({ summary: 'Get form submissions by status' })
  // @ApiResponse({ status: 200, description: 'Form submissions with the specified status retrieved successfully!' })
  // async getFormsByStatus(@Query('status') status: string) {
  //   const { data, totalCount } = await this.formService.getSubmissionsByStatus(status);
  //   return {
  //     message: `Form submissions with status '${status}' retrieved successfully!`,
  //     data,
  //     totalCount,
  //   };
  // }
  @Get('status')
  @ApiOperation({ summary: 'Get form submissions by status' })
  @ApiResponse({ status: 200, description: 'Form submissions with the specified status retrieved successfully!' })
  async getFormsByStatus(
    @Query('status') status: string,
    @Query('offset') offset: string,
    @Query('pageSize') pageSize: string
  ) {
    const { data, totalCount } = await this.formService.getSubmissionsByStatus(status , offset , pageSize);
    return {
      message: `Form submissions with status '${status}' retrieved successfully!`,
      data,
      totalCount,
    };
  }
  @Patch('/updateStatus')
  // @ApiOperation({ summary: 'Update the status of a form' })
  @ApiResponse({ status: 200, description: 'The status has been successfully updated.', type: Form })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateStatus(@Query() updateFormStatusDto: UpdateFormStatusDto): Promise<Form> {
    return this.formService.updateStatus(updateFormStatusDto);
  }

  @Get('count')
  @ApiResponse({ status: 200, description: 'Count of leads retrieved successfully!' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getCount(@Query('status') status: string) {
    try {
      const count = await this.formService.getCount(status);
      return {
        message: 'Count of leads retrieved successfully!',
        count,
      };
    } catch (error) {
      return {
        message: 'Failed to retrieve count of leads',
        error: error.message,
      };
    }
  }
  @Post('enqueryForm')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Get all Data' })
  @ApiResponse({ status: 200, description: 'EnqueryForm Data Created successfully!' })
  @ApiResponse({ status: 500, description: 'Error in Submitting form!' })
  async submitInquiryForm(@Body() enqueryFormDto: EnqueryFormDto) {
    try{
      const result  = await this.formService.saveInqueryForm(enqueryFormDto);
      return {
        message: 'Form submitted successfully!',
        uuid: result.uuid,
        data: result,
      };
    }
    catch(error){
      return {
        message: 'Failed to submit form',
        error: error.message,
      };
    }
  }
  @Get('enqueryForm/get')
  @ApiOperation({ summary: 'Get all Data' })
  @ApiResponse({ status: 200, description: 'EnqueryForm Data retrieved successfully!' })
  async getAllInquiryForms() {
    return {
      message: 'Form submissions retrieved successfully!',
      data: await this.formService.getInqueryForm(),
    };
  }


  @Get('enqueryForm/find')
  @ApiOperation({ summary: 'Get all Data' })
  @ApiResponse({ status: 200, description: 'EnqueryForm Data retrieved successfully!' })
  async getInquiryForm(@Query('customId') customId: string) {
    return {
      message: 'contact form retrieved successfully!',
      data: await this.formService.getInqueryFormBycustomId(customId),
    };
  }


  @Post('feeSubmit')
  @ApiOperation({ summary: 'Set user Fee' })
  @ApiResponse({ status: 200, description: 'Fee Submitted successfully!' })
  @ApiResponse({ status: 500, description: 'Error in Submitting fee!' })
  async submitFee(@Body() feeSubmissionDto: FeeSubmissionDto) {
    const result = await this.formService.saveFee(feeSubmissionDto);
    return {
      message: 'fee submitted successfully!',
      uuid: result.uuid,
      customId:result.customId,
      data: result,
    };
  }

  @Patch('fee/update')
  @ApiOperation({ summary: 'Update Fee Status' })
  @ApiResponse({ status: 200, description: 'Fee Status Updated successfully!' })
  @ApiResponse({ status: 500, description: 'Error in Updating fee!' })
  async updateFeeStatus(@Query('uuid') uuid: string, @Body() feeSubmissionDto: FeeSubmissionDto) {
    const result = await this.formService.updateFeeData(uuid, feeSubmissionDto);
    return {
      message: 'Fee status updated successfully!',
      data: result,
    };
  }


  @Get('fee/details')
  @ApiOperation({ summary: 'Get all Data' })
  @ApiResponse({ status: 200, description: 'Fee Data retrieved successfully!' })
  async getAllFeeDetails() {
    return {
      message: 'Fee submissions retrieved successfully!',
      data: await this.formService.getFeeDetails(),
    };
  }
  @Get('fee/details/csv')
  @ApiOperation({ summary: 'Get Fee Details as CSV' })
  @ApiResponse({ status: 200, description: 'CSV file generated successfully!' })
  async getFeeDetailsCsv(@Res() res: Response) {
    const csvData = await this.formService.getFeeDetailsCsv();
    res.header('Content-Type', 'text/csv');
    res.attachment('fee-details.csv');
    res.send(csvData);
  }

  @Get('lead/csv')
  @ApiOperation({ summary: 'Get Lead Details as CSV' })
  @ApiResponse({ status: 200, description: 'CSV file generated successfully!' })
  async getLeadDetailCsv(@Res() res: Response) {
    const csvData = await this.formService.getLeadDetailsCsv();
    res.header('Content-Type', 'text/csv');
    res.attachment('lead-details.csv');
    res.send(csvData);
  }
}


