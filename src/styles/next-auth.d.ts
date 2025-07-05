import 'next-auth';
import 'next-auth/adapters';
import 'next-auth/jwt';
import type { UserRole } from '@/types/UserTypes';

declare module 'next-auth' {
  interface User {
    _id: string;
    email: string;
    name: string;
    userRole: (typeof UserRole)[keyof typeof UserRole];
  }
}
