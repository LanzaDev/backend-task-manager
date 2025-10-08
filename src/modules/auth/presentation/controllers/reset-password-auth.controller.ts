import { MessageResponseDTO } from '@/core/presentation/dto/message-response.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { VerifyResetPasswordDTO } from '../dto/input/verify-reset-password-token.dto';
import { VerifyResetPasswordCommand } from '../../application/use-cases/commands/implements/verify-reset-password.command';
import { ResetPasswordCommand } from '../../application/use-cases/commands/implements/reset-password.command';
import { ResetPasswordDTO } from '../dto/input/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class VerifyResetPasswordAuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('reset-password/verify')
  @ApiOperation({ summary: 'Reset user password using token' })
  @ApiBody({ type: VerifyResetPasswordDTO })
  @ApiOkResponse({
    description: 'Password reset successfully',
    type: MessageResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token or password mismatch',
  })
  async verifyResetPassword(@Body() dto: VerifyResetPasswordDTO) {
    const { token, code } = dto;

    await this.commandBus.execute(new VerifyResetPasswordCommand(token, code));

    return { message: 'success' };
  }

  @Post('reset-password/confirm')
  async resetPassword(@Body() dto: ResetPasswordDTO) {
    const { password, confirmPassword, token, code } = dto;

    await this.commandBus.execute(
      new ResetPasswordCommand(password, confirmPassword, token, code),
    );

    return { success: true };
  }
}
