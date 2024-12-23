import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';

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
        uuid: result.uuid, // Return the UUID here
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
  async getAllForms() {
    return {
      message: 'Form submissions retrieved successfully!',
      data: await this.formService.getSubmissions(),
    };
  }
}
