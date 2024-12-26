import { Injectable, ConflictException, UnauthorizedException , NotFoundException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from './schema/admin.schema';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) {}

  async register(adminRegisterDto: AdminRegisterDto) {
    const { username, password, email } = adminRegisterDto;

    // Check if username or email already exists
    const existingAdmin = await this.adminModel.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new admin
    const newAdmin = new this.adminModel({ username, password: hashedPassword, email });
    await newAdmin.save();

    return { message: 'Admin registered successfully' };
  }

  async login(adminLoginDto: AdminLoginDto) {
    const { username, password } = adminLoginDto;

    // Find the admin by username
    const admin = await this.adminModel.findOne({ username });
    if (!admin) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return { message: 'Admin logged in successfully' };
  }
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    // Find admin by email
    const admin = await this.adminModel.findOne({ email });
    if (!admin) {
      throw new NotFoundException('Email not found');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour

    admin.resetToken = resetToken;
    admin.resetTokenExpiration = resetTokenExpiration;
    await admin.save();

    // Send reset token via email (pseudo-code)
    // Replace this with actual email sending logic
    console.log(`Reset token (send this via email): ${resetToken}`);

    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    // Find admin by reset token
    const admin = await this.adminModel.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: new Date() },
    });

    if (!admin) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash the new password and update admin
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.resetToken = undefined;
    admin.resetTokenExpiration = undefined;
    await admin.save();

    return { message: 'Password reset successfully' };
  }

  async updateUsername(updateUsernameDto: UpdateUsernameDto) {
    const { currentUsername, newUsername } = updateUsernameDto;

    // Check if the current username exists
    const admin = await this.adminModel.findOne({ username: currentUsername });
    if (!admin) {
      throw new NotFoundException('Admin with the current username not found');
    }

    // Check if the new username is already taken
    const usernameExists = await this.adminModel.findOne({ username: newUsername });
    if (usernameExists) {
      throw new ConflictException('The new username is already taken');
    }

    // Update the username
    admin.username = newUsername;
    await admin.save();

    return { message: 'Username updated successfully' };
  }

  async updateEmail(updateEmailDto: UpdateEmailDto) {
    const { currentEmail, newEmail } = updateEmailDto;

    // Check if the current email exists
    const admin = await this.adminModel.findOne({ email: currentEmail });
    if (!admin) {
      throw new NotFoundException('Admin with the current email not found');
    }

    // Check if the new email is already taken
    const emailExists = await this.adminModel.findOne({ email: newEmail });
    if (emailExists) {
      throw new ConflictException('The new email is already taken');
    }

    // Update the email
    admin.email = newEmail;
    await admin.save();

    return { message: 'Email updated successfully' };
  }
}
