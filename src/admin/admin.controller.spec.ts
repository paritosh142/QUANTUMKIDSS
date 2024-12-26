import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  @Post('register')
  async register(@Body() adminRegisterDto: AdminRegisterDto) {
    return this.adminService.register(adminRegisterDto);
  }

  @ApiResponse({ status: 200, description: 'Admin logged in successfully' })
  @Post('login')
  async login(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminService.login(adminLoginDto);
  }
}
