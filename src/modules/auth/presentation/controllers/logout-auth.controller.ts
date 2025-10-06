import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LogoutUserCommand } from '../../application/use-cases/commands/implements/logout-user.command';
import { LogoutDTO } from '../dto/input/logout.dto';
import { MessageResponseDTO } from '@/core/presentation/dto/message-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class LogoutAuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('logout')
  @ApiOperation({ summary: 'Logout user and invalidate refresh token' })
  @ApiBody({ type: LogoutDTO })
  @ApiOkResponse({
    description: 'Logout successful',
    type: MessageResponseDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token or user mismatch' })
  async logoutSession(@Body() dto: LogoutDTO): Promise<MessageResponseDTO> {
    await this.commandBus.execute(
      new LogoutUserCommand(dto.userId, dto.refreshToken),
    );
    return new MessageResponseDTO('Logout successful.');
  }
}
