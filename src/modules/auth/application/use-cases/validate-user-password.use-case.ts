import { Injectable } from '@nestjs/common';
import { User } from '@/modules/user/domain/entities/user.entity';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { Email } from '@/shared/domain/value-objects/email.vo';

@Injectable()
export class ValidateUserPasswordUseCase {
  constructor(
    private readonly findUserByEmailRepository: IUserRepository,
  ) {}

  // async execute(email: string, plainPassword: string): Promise<User> {
  //   const emailVO = new Email(email);
  //   const user = await this.findUserByEmailRepository.findByEmail(emailVO);

  //   if (!user) {
  //     throw new Error('Invalid email or credentials');
  //   }

  //   const isValid = await user.validatePassword(plainPassword);
  //   if (!isValid) {
  //     throw new Error('Invalid email or credentials');
  //   }

  //   return user;
  // }
}
