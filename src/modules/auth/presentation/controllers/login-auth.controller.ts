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
    return await this.queryBus
      .execute(new ValidateUserCredentialsQuery(dto.email, dto.password))
      .then((user) =>
        this.commandBus.execute(new CreateUserSessionCommand(user)),
      );
  }
}
