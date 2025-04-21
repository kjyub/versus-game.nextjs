import User from '@/types/user/User'
import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import MUser from './models/user/MUser'
import DBUtils from './utils/DBUtils'

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
        await DBUtils.connect()
        try {
          const mUser = await MUser.findOne({
            email: credentials.email,
            isDeleted: false,
          })
          if (mUser) {
            const isPasswordCorrect = await bcrypt.compare(credentials.password, mUser.password)
            if (isPasswordCorrect) {
              try {
                mUser.password = ''
              } catch {
                //
              }

              return mUser
            }
          }
          throw new Error()
        } catch (err: any) {
          throw new Error(err)
        }
      },
      // async authorize(credentials) {
      //     if (credentials.id && credentials.password) {
      //         // 백엔드에서 로그인 처리
      //         // let loginRes = await backendLogin(credentials.id, credentials.password)
      //         let loginRes = {
      //             success: true,
      //             data: {
      //                 user: {
      //                     ID: "user1",
      //                     NAME: "홍길동",
      //                     EMAIL: "email@email.email",
      //                 },
      //             },
      //         }
      //         // 로그인 실패 처리
      //         if (!loginRes.success) return null
      //         // 로그인 성공 처리
      //         const user = {
      //             id: loginRes.data.user.ID ?? "",
      //             name: loginRes.data.user.NAME ?? "",
      //             email: loginRes.data.user.EMAIL ?? "",
      //         } as User
      //         return user
      //     }
      //     return null
      // },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user = token.user as User
      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user
      }
      return token
    },
  },
})
