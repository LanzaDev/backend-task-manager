import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUserRepository } from '@/modules/user/domain/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from '../dto/input/login.dto';
import { ResponseUserDTO } from '@/modules/user/application/dto/output/response-user.dto';
import { SignResponseDTO } from '../dto/output/sign-response.dto';
import { Token } from '@/shared/domain/value-objects/token.vo';
import { Email } from '@/shared/domain/value-objects/email.vo';

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDTO): Promise<SignResponseDTO> {
    const email = new Email(dto.email);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const valid = await user.validatePassword(dto.password);
    if (!valid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = new Token(
      this.jwtService.sign({ sub: user.getId(), role: user.getRole() }),
    );

    return {
      user: new ResponseUserDTO(user),
      token: token.getValue(),
    };
  }
}
