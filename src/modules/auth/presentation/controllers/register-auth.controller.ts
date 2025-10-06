import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateAccountCommand } from '../../application/use-cases/commands/implements/create-account.command';
import { RegisterDTO } from '../dto/input/register.dto';
import { MessageResponseDTO } from '@/core/presentation/dto/message-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class RegisterAuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDTO })
  @ApiOkResponse({
    description: 'Account successfully created',
    type: MessageResponseDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid input data' })
  async signUp(@Body() dto: RegisterDTO): Promise<MessageResponseDTO> {
    await this.commandBus.execute(
      new CreateAccountCommand(
        dto.name,
        dto.email,
        dto.password,
        dto.confirmPassword,
      ),
    );

    return new MessageResponseDTO(
      'User registered successfully. Please verify your email.',
    );
  }
}
