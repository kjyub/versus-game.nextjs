"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import CommonUtils from "@/utils/CommonUtils"
import User from "@/types/user/User"
import { useRouter } from "next/navigation"
import ApiUtils from "@/utils/ApiUtils"
import { UserRole } from "@/types/UserTypes"

export default function StaffLayout({children}) {
    const router = useRouter()
    const session = useSession()
    const [user, setUser] = useState<User>(new User())

    useEffect(() => {
        getUser()
    }, [session.status])

    const getUser = async () => {
        if (session.status === "loading") {
            return
        } else if (session.status === "unauthenticated") {
            router.push("/")
        }

        const [bResult, statusCode, response] = await ApiUtils.request(
            `/api/users/user_info/${session.data.user._id}`, 
            "GET",
        )

        const newUser = new User()
        if (bResult) {
            newUser.parseResponse(response)
            setUser(newUser)
        }

        if (CommonUtils.isStringNullOrEmpty(newUser.id) || newUser.userRole !== UserRole.STAFF) {
            router.push("/")
        }
    }

    if (CommonUtils.isStringNullOrEmpty(user.id)) {
        return
    }

    return (
        <div className="flex flex-col w-full bg-black">

            {children}
        </div>
    )
}