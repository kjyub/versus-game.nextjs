import MUser from "@/models/user/MUser"
import DBUtils from "@/utils/DBUtils"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import ApiUtils from "@/utils/ApiUtils"
// import { getSession } from "next-auth/react"
import { auth } from "@/auth"
import { NextApiRequest, NextApiResponse } from "next"

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    // const { email } = await req.json()
    const session = await auth()
    console.log(session)
    return ApiUtils.response(true)

    // await DBUtils.connect()
    // const users = await MUser.findOne({ email: email })

    // let isExist: boolean = false
    // if (users) {
    //     isExist = true
    // }

    // return ApiUtils.response(isExist)
}
