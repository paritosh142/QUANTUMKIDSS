import { Body, Controller, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateFormStatusDto } from './dto/update-status.dto';
import { Form } from './schema/form.schema';

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
    @Query('offset') offset: number,
    @Query('pageSize') pageSize: number
  ) {
    return {
      message: 'Form submissions retrieved successfully!',
      data: await this.formService.getSubmissions(offset, pageSize),
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
    @Query('offset') offset: number,
    @Query('pageSize') pageSize: number
  ) {
    const { data, totalCount } = await this.formService.getSubmissionsByStatus(status, offset, pageSize);
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

}
