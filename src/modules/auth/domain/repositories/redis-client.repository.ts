import { RedisClientType } from 'redis';

export abstract class RedisClientRepository {
  abstract getClient(): RedisClientType;
}
