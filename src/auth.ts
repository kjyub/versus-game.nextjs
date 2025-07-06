import type User from '@/types/user/User';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import MUser from './models/user/MUser';
import DBUtils from './utils/DBUtils';

// https://velog.io/@youngjun625/Next.js14-NextAuth-v5%EB%A1%9C-%EC%9D%B8%EC%A6%9D-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-1-%EB%A1%9C%EA%B7%B8%EC%9D%B8%EB%A1%9C%EA%B7%B8%EC%95%84%EC%9B%83
export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        await DBUtils.connect();
        try {
          const mUser = await MUser.findOne({
            email: credentials.email,
            isDeleted: false,
          });
          if (mUser) {
            const isPasswordCorrect = await bcrypt.compare(credentials.password, mUser.password);
            if (isPasswordCorrect) {
              const userObject = mUser.toObject();
              if (userObject._id && typeof userObject._id !== 'string') {
                userObject._id = userObject._id.toString();
              }
              delete userObject.password;

              return userObject;
            }
          }
          throw new Error('Invalid credentials');
        } catch (err: any) {
          console.error('Authentication error:', err);
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as AdapterUser & User;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
});
