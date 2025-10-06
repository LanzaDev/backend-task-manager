import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { VerifyEmailCommand } from '../../application/use-cases/commands/implements/verify-email.command';
import { VerifyEmailDTO } from '../dto/input/verify-email';
import { MessageResponseDTO } from '../../../../core/presentation/dto/message-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class VerifyEmailAuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify user email using token or code' })
  @ApiBody({ type: VerifyEmailDTO })
  @ApiOkResponse({
    description: 'Email verified successfully',
    type: MessageResponseDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  async verifyEmailToken(
    @Body() dto: VerifyEmailDTO,
  ): Promise<MessageResponseDTO> {
    await this.commandBus.execute(new VerifyEmailCommand(dto.token, dto.code));
    return new MessageResponseDTO('Email verified successfully.');
  }
}
