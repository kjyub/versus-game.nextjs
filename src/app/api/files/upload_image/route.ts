import DBUtils from "@/utils/DBUtils"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import ApiUtils from "@/utils/ApiUtils"
import { NextApiRequest } from "next"
import MFile from "@/models/file/MFile"

export async function POST(req: NextApiRequest) {
    const r = await req.json()
    console.log(r)

    // await DBUtils.connect()

    // const mFile = new MFile({
    //     email: email,
    //     password: hashedPassword,
    //     name: name,
    // })

    // try {
    //     const resultUser = await mFile.save()

    //     return ApiUtils.response(resultUser)
    // } catch (err: any) {
    //     console.log("에러", err)
    //     return ApiUtils.serverError(err)
    // }
    // await DBUtils.insertDocument("VersusGame", "users", data)
    // return NextResponse.json({
    //     name: "John Doe",
    // })
}
