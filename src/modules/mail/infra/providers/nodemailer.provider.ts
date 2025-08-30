import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IEmailProvider } from './email.provider';
import { SendEmailDTO } from '../../application/dto/output/send-email.dto';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodemailerEmailProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: Number(this.configService.get<string>('EMAIL_PORT')),
      secure: false, // 587 - false | 465 true
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(dto: SendEmailDTO) {
    const { to, subject, html, text } = dto;

    if (!to || to.length === 0) {
      throw new Error('No recipients defined');
    }

    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: to.join(', '),
      subject,
      html,
      text: text || '',
    };

    try {
      await this.transporter.sendMail(options);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending mail:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
