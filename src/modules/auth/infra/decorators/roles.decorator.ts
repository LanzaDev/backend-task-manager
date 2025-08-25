import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// chave que será usada para recuperar o metadata dentro do guard
export const ROLES_KEY = 'roles';

// decorator em si
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
