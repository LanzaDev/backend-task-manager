import { SendEmailDTO } from '../../application/dto/output/send-email.dto';

export interface IEmailProvider {
  sendEmail(dto: SendEmailDTO): Promise<void>;
}
