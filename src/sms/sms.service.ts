import { Injectable } from '@nestjs/common';
// import * as twilio from 'twilio';

@Injectable()
export class SmsService {
  // private client: twilio.Twilio;

  // constructor() {
  //   const accountSid = process.env.TWILIO_ACCOUNT_SID;
  //   const authToken = process.env.TWILIO_AUTH_TOKEN;
  //   if (!accountSid || !authToken) {
  //     throw new Error('Twilio credentials are not set');
  //   }
  //   this.client = twilio(accountSid, authToken);
  // }

  // async sendSms(to: string, message: string): Promise<void> {
  //   await this.client.messages.create({
  //     body: message,
  //     from: process.env.TWILIO_PHONE_NUMBER,
  //     to,
  //   });
  // }
}
