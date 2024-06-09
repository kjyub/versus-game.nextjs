import MUser from "@/models/user/MUser"
import DBUtils from "@/utils/DBUtils"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import ApiUtils from "@/utils/ApiUtils"
import { NextApiRequest } from "next"

export async function POST(req: NextApiRequest) {
    const { email } = await req.json()

    await DBUtils.connect()
    const users = await MUser.findOne({ email: email })

    let isExist: boolean = false
    if (users) {
        isExist = true
    }

    return ApiUtils.response(isExist)
}
