import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/auth/entities/roles.entity';
export const ROLES_KEY = 'roles';
export const Role = (...roles: Roles[]) =>SetMetadata(ROLES_KEY, roles);