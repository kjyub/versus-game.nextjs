import NextAuth from "next-auth"
import { Account, User as AuthUser } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import MUser from "@/models/user/MUser"
import DBUtils from "@/utils/DBUtils"

export const authOptions: any = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any) {
                await DBUtils.connect()
                try {
                    const user = await MUser.findOne({
                        email: credentials.email,
                    })
                    if (user) {
                        const isPasswordCorrect = await bcrypt.compare(
                            credentials.password,
                            user.password,
                        )
                        if (isPasswordCorrect) {
                            return user
                        }
                    }
                } catch (err: any) {
                    throw new Error(err)
                }
            },
        }),
        // GithubProvider({
        //   clientId: process.env.GITHUB_ID ?? "",
        //   clientSecret: process.env.GITHUB_SECRET ?? "",
        // }),
        // ...add more providers here
    ],
    callbacks: {
        async signIn({ user, account }: { user: AuthUser; account: Account }) {
            if (account?.provider == "credentials") {
                return true
            }
            //   if (account?.provider == "github") {
            //     await DBUtils.connect()
            //     try {
            //       const existingUser = await MUser.findOne({ email: user.email });
            //       if (!existingUser) {
            //         const newUser = new User({
            //           email: user.email,
            //         });

            //         await newUser.save();
            //         return true;
            //       }
            //       return true;
            //     } catch (err) {
            //       console.log("Error saving user", err);
            //       return false;
            //     }
            //   }
        },
    },
}

export const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
