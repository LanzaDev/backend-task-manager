import { Role } from '@/shared/types/role.type';

export interface JwtUser {
  sub: string;
  role: Role;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}
