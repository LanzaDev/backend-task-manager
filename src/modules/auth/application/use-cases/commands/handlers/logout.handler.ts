import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Redis from 'ioredis';

import { AbstractAuthTokenCacheWriteRepository } from '@/modules/auth/domain/repositories/auth-token-cache.write-repository';
import { AbstractAuthTokenCacheReadRepository } from '../../../../domain/repositories/auth-token-cache.read-repository';
import { LogoutUserCommand } from '../implements/logout-user.command';
import { REDIS_CLIENT } from '@/shared/infra/config/redis.config';

@Injectable()
@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
  constructor(
    @Inject(REDIS_CLIENT) private readonly client: Redis,
    private readonly authTokenCacheWriteRepository: AbstractAuthTokenCacheWriteRepository,
    private readonly authTokenCacheReadRepository: AbstractAuthTokenCacheReadRepository,
  ) {}

  async execute(command: LogoutUserCommand) {
    const lockKey = `logout-lock:${command.refreshToken}`;

    const gotLock = await this.client.set(lockKey, '1', 'EX', 5, 'NX');
    if (!gotLock) {
      return false;
    }

    const userId = await this.authTokenCacheReadRepository.getUserIdByToken(
      command.refreshToken,
    );

    if (!userId) {
      return false;
    }

    await this.authTokenCacheWriteRepository.deleteRefreshToken(
      command.refreshToken,
    );
    await this.authTokenCacheWriteRepository.deleteSession(userId);
    await this.client.del(lockKey);

    return true;
  }
}
