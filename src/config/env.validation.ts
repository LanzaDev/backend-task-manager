import { z } from 'zod';

export const envSchema = z.object({
  // Database
  DATABASE_URL: z.string(),
});
