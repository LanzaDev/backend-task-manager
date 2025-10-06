import { z } from 'zod';

export const envSchema = z.object({
  // APP
  APP_NAME: z.string().default('Task Manager'),
  APP_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  APP_PORT: z.coerce.number().default(3000),
  APP_URL: z.string().default('http://localhost:3000'),

  // Database
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_NAME: z.string(),
  DATABASE_URL: z.string(),

  // Cache
  CACHE_HOST: z.string(),
  CACHE_PORT: z.coerce.number(),
  CACHE_PASSWORD: z.string(),
  CACHE_DB: z.coerce.number().default(0),
  CACHE_TTL: z.coerce.number().default(5),
  CACHE_URL: z.string(),

  // JWT
  JWT_SECRET: z.string().default('secret-key-123'),
  ACCESS_TOKEN_EXP: z.coerce.number().default(15),
  REFRESH_TOKEN_EXP: z.coerce.number().default(7),

  // Email
  EMAIL_HOST: z.string().default('smtp.example.com'),
  EMAIL_PORT: z.coerce.number().default(587),
  EMAIL_USER: z.string().default('usar@example.com'),
  EMAIL_PASSWORD: z.string().default('password123'),
  EMAIL_FAKE: z.coerce.boolean().default(true),
});
