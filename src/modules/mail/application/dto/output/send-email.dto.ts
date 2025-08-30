import { IsString, IsOptional, IsEmail } from 'class-validator';

export class SendEmailDTO {
  @IsEmail({}, { each: true })
  to: string[];

  @IsString()
  subject: string;

  @IsString()
  html: string;

  @IsOptional()
  @IsString()
  text?: string;
}
