import MUser from "@/models/user/MUser"
import DBUtils from "@/utils/DBUtils"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import ApiUtils from "@/utils/ApiUtils"

export async function POST(req: NextRequest) {
    const { email } = await req.json()

    await DBUtils.connect()
    const users = await MUser.findOne({ email: email })

    let isExist: boolean = false
    if (users) {
        isExist = true
    }

    return ApiUtils.response(isExist)
}
