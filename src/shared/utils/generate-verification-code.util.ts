import { randomBytes } from 'crypto';

export function GenerateVerificationCode(length = 6): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(length);
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}
