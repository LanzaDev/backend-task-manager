import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDTO {
  @ApiProperty({
    examples: {
      messageRegister:
        'User registered successfully. Please verify your email.',
      requestPasswordReset: 'Password reset email sent successfully.',
    },
  })
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
