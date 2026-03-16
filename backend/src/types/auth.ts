import type { UserRole } from '../constants/enums.js';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface TokenPayload extends AuthUser {}

