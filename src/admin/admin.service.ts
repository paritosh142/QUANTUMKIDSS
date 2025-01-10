import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan as TypeOrmMoreThan } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Admin } from './schema/admin.schema';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async register(adminRegisterDto: AdminRegisterDto) {
    const { username, password, email } = adminRegisterDto;

    const existingAdmin = await this.adminRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingAdmin) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = this.adminRepository.create({
      username,
      password: hashedPassword,
      email,
    });
    await this.adminRepository.save(newAdmin);

    return { message: 'Admin registered successfully' };
  }

  async login(adminLoginDto: AdminLoginDto) {
    const { username, password } = adminLoginDto;

    const admin = await this.adminRepository.findOne({ where: { username } });
    if (!admin) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { username: admin.username, sub: admin.id };
    const token = this.jwtService.sign(payload);

    return { message: 'Admin logged in successfully', token };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new NotFoundException('Email not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = new Date(Date.now() + 3600000);

    admin.resetToken = resetToken;
    admin.resetTokenExpiration = resetTokenExpiration;
    await this.adminRepository.save(admin);

    console.log(`Reset token (send this via email): ${resetToken}`);

    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { currentPassword, newPassword } = resetPasswordDto;

    const admin = await this.adminRepository.findOne({
      where: { username: resetPasswordDto.username },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedNewPassword;
    await this.adminRepository.save(admin);

    return { message: 'Password reset successfully' };
  }

  async updateUsername(updateUsernameDto: UpdateUsernameDto) {
    const { currentUsername, newUsername } = updateUsernameDto;

    const admin = await this.adminRepository.findOne({
      where: { username: currentUsername },
    });
    if (!admin) {
      throw new NotFoundException('Admin with the current username not found');
    }

    const usernameExists = await this.adminRepository.findOne({
      where: { username: newUsername },
    });
    if (usernameExists) {
      throw new ConflictException('The new username is already taken');
    }

    admin.username = newUsername;
    await this.adminRepository.save(admin);

    return { message: 'Username updated successfully' };
  }

  async updateEmail(updateEmailDto: UpdateEmailDto) {
    const { currentEmail, newEmail } = updateEmailDto;

    const admin = await this.adminRepository.findOne({
      where: { email: currentEmail },
    });
    if (!admin) {
      throw new NotFoundException('Admin with the current email not found');
    }

    const emailExists = await this.adminRepository.findOne({
      where: { email: newEmail },
    });
    if (emailExists) {
      throw new ConflictException('The new email is already taken');
    }

    admin.email = newEmail;
    await this.adminRepository.save(admin);

    return { message: 'Email updated successfully' };
  }
}