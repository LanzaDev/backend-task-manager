import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class DeleteUserDTO {
  @IsUUID()
  id!: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
