import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from '@/modules/user/domain/entities/user.entity';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from '../dto/input/register.dto';
import { ResponseUserDTO } from '@/modules/user/application/dto/output/response-user.dto';
import { SignResponseDTO } from '../dto/output/sign-response.dto';
import { Token } from '@/shared/domain/value-objects/token.vo';
import { Email } from '@/shared/domain/value-objects/email.vo';
import { Password } from '@/shared/domain/value-objects/password.vo';

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

    await this.userRepository.create(user);

    const token = new Token(
      this.jwtService.sign({ sub: user.getId(), role: user.getRole() }),
    );

    return {
      user: new ResponseUserDTO(user),
      token: token.getValue(),
    };
  }
}
