import { Body, Controller, Post, Patch } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminService } from './admin.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@ApiTags('Admin') 
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  @Post('register')
  async register(@Body() adminRegisterDto: AdminRegisterDto) {
    return this.adminService.register(adminRegisterDto);
  }

  @ApiResponse({ status: 201, description: 'Admin logged in successfully' })
  @Post('login')
  async login(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminService.login(adminLoginDto);
  }

  @ApiResponse({ status: 200, description: 'Password reset link sent' })
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.adminService.forgotPassword(forgotPasswordDto);
  }

  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.adminService.resetPassword(resetPasswordDto);
  }
  @ApiResponse({ status: 200, description: 'Username updated successfully' })
  @Patch('update-username')
  async updateUsername(@Body() updateUsernameDto: UpdateUsernameDto) {
    return this.adminService.updateUsername(updateUsernameDto);
  }

  @ApiResponse({ status: 200, description: 'Email updated successfully' })
  @Patch('update-email')
  async updateEmail(@Body() updateEmailDto: UpdateEmailDto) {
    return this.adminService.updateEmail(updateEmailDto);
  }
}
