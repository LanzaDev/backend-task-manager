import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseUserDTO } from '@/modules/user/presentation/dto/output/response-user.dto';

export class SignResponseDTO {
  @Expose()
  @ApiProperty({ type: () => ResponseUserDTO })
  user: ResponseUserDTO;

  @Expose()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNTAwMzQ3YS1hYjJhLTQ2YjItYjQ4Yy1lNGEyNDRjMmNhMzkiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1ODUzNjAzNSwiZXhwIjoxNzU4NTM2OTM1fQ.FMidBhBQao8wcDAcvoA8HKw1u0JgKKl5_S9ZzbMLrl4',
  })
  accessToken: string;

  @Expose()
  @ApiProperty({ example: '71043657-98a9-4418-a080-af9958649e43' })
  refreshToken: string;

  constructor(
    user: ResponseUserDTO,
    accessToken: string,
    refreshToken: string,
  ) {
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
