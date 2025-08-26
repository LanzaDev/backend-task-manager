import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { Email } from '@/shared/domain/value-objects/email.vo';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: IUserRepository,
  ) {}

  async validateUser(email: string, plainPassword: string) {
    const user = await this.userRepository.findByEmail(new Email(email));
    if (!user) return null;

    const isValid = await user.validatePassword(plainPassword);
    if (!isValid) return null;

    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, role: user.role.getRole() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
