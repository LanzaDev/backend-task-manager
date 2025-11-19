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
import { ResetPasswordCommand } from '../../application/use-cases/commands/implements/reset-password.command';
import { ResetPasswordDTO } from '../dto/input/reset-password.dto';
import { VerifyRecoveryCommand } from '../../application/use-cases/commands/implements/verify-recovery.command';
import { VerificationType } from '@prisma/client';

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
  async verifyResetPassword(@Body() body: VerifyResetPasswordDTO) {
    const { token, code } = body;

    const command = new VerifyRecoveryCommand(
      VerificationType.RESET_PASSWORD,
      token,
      code,
    );

    await this.commandBus.execute(command);

    return { message: 'success' };
  }

  @Post('reset-password/confirm')
  async resetPassword(@Body() body: ResetPasswordDTO) {
    const data = new VerifyRecoveryCommand(
      VerificationType.RESET_PASSWORD,
      body.token,
      body.code,
    );

    await this.commandBus.execute(
      new ResetPasswordCommand(body.password, data),
    );

    return { message: 'Password reset successfully' };
  }
}
