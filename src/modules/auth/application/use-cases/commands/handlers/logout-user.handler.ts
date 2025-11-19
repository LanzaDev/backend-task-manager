import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Redis from 'ioredis';

import { AbstractAuthTokenCacheWriteRepository } from '@/modules/auth/domain/repositories/auth-token-cache.write-repository';
import { AbstractAuthTokenCacheReadRepository } from '../../../../domain/repositories/auth-token-cache.read-repository';
import { LogoutUserCommand } from '../implements/logout-user.command';
import { REDIS_CLIENT } from '@/shared/infra/config/redis.config';
import { AbstractUserReadRepository } from '@/modules/user/domain/repositories/user.read-repository';

@Injectable()
@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
  constructor(
    @Inject(REDIS_CLIENT) private readonly client: Redis,
    private readonly authTokenCacheWriteRepository: AbstractAuthTokenCacheWriteRepository,
    private readonly authTokenCacheReadRepository: AbstractAuthTokenCacheReadRepository,
    private readonly userReadRepository: AbstractUserReadRepository,
  ) {}

  async execute(command: LogoutUserCommand) {
    const { userId, refreshToken } = command;
    const lockKey = `logout-lock:${command.refreshToken}`;

    const user = await this.userReadRepository.findById(command.userId);
    if (!user) {
      return false;
    }

    const gotLock = await this.client.set(lockKey, '1', 'EX', 5, 'NX');
    if (!gotLock) {
      return false;
    }

    try {
      const storedUserId =
        await this.authTokenCacheReadRepository.getUserIdByToken(refreshToken);

      if (!storedUserId || storedUserId !== userId) {
        return false;
      }

      await this.authTokenCacheWriteRepository.deleteRefreshToken(refreshToken);
      await this.authTokenCacheWriteRepository.deleteSession(userId);

      return true;
    } finally {
      await this.client.del(lockKey);
    }
  }
}
