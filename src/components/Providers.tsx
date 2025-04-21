import { auth } from "@/auth"
import { UiProvider } from "@/stores/contexts/UiProvider"
import { SessionProvider } from "next-auth/react"

const Providers = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth()
    return (
        <SessionProvider session={session}>
            <UiProvider>
                {children}
            </UiProvider>
        </SessionProvider>
    )
}

export default Providers