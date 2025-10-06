import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RequestPasswordResetCommand } from '../../application/use-cases/commands/implements/request-password-reset.command';
import { RequestPasswordResetDTO } from '../dto/input/request-password-reset.dto';
import { MessageResponseDTO } from '@/core/presentation/dto/message-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class RequestPasswordResetAuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('request-password-reset')
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiBody({ type: RequestPasswordResetDTO })
  @ApiOkResponse({
    description: 'Password reset email sent',
    type: MessageResponseDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email' })
  async forgotPassword(
    @Body() dto: RequestPasswordResetDTO,
  ): Promise<MessageResponseDTO> {
    await this.commandBus.execute(new RequestPasswordResetCommand(dto.email));
    return new MessageResponseDTO('Password reset email sent successfully.');
  }
}
