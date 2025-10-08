import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserSessionCommand } from '../../application/use-cases/commands/implements/create-user-session.command';
import { ValidateUserCredentialsQuery } from '../../application/use-cases/query/implements/validate-user-credentials.query';
import { LoginDTO } from '../dto/input/login.dto';
import { SignResponseDTO } from '../dto/output/sign-response.dto';
import { ResponseUserDTO } from '@/modules/user/presentation/dto/output/response-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class LoginAuthController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({
    description: 'Login successful',
    type: SignResponseDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async signIn(@Body() dto: LoginDTO): Promise<SignResponseDTO> {
    const user = await this.queryBus.execute<ResponseUserDTO>(
      new ValidateUserCredentialsQuery(dto.email, dto.password),
    );

    return this.commandBus.execute<SignResponseDTO>(
      new CreateUserSessionCommand(user),
    );
  }
}
