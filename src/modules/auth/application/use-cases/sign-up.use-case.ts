import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from '../dto/input/register.dto';
import { SignResponseDTO } from '../dto/output/sign-response.dto';
import { Token } from '@/shared/domain/value-objects/token.vo';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';
import { ResponseUserDTO } from '@/modules/user/application/dto/output/response-user.dto';
import { User } from '@/modules/user/domain/entities/user.entity';

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RegisterDTO): Promise<SignResponseDTO> {
    const name = dto.name;
    const email = new Email(dto.email);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const password = await Password.create(dto.password);
    const user = new User({
      name,
      email,
      password,
    });

    await this.userRepository.save(user);

    const token = new Token(
      this.jwtService.sign({ sub: user.getId(), role: user.getRole() }),
    );

    return {
      user: new ResponseUserDTO(user),
      token: token.getValue(),
      redirectUrl: user.getEmailValue() === 'admin@rdx.com' ? '/admin' : '/user',
    };
  }
}
