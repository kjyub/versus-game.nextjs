import DBUtils from "@/utils/DBUtils"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import ApiUtils from "@/utils/ApiUtils"
import { NextApiRequest } from "next"
import MVersusGame from "@/models/versus/MVersusGame"
import { auth } from "@/auth"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import MFile from "@/models/file/MFile"

export async function GET(req: NextApiRequest) {
    const mGames = await MVersusGame.find().sort({ createdAt: -1 })

    return ApiUtils.response(mGames)
}

export async function POST(req: NextApiRequest) {
    const { title, content, thumbnailImageId, choices } = await req.json()

    await DBUtils.connect()

    const session = await auth()

    // 유저 확인
    if (!session.user) {
        return ApiUtils.notAuth()
    }

    // 썸네일
    let thumbnailImageUrl = ""
    try {
        const mFile = await MFile.findOne({ _id: thumbnailImageId })
        if (mFile) {
            thumbnailImageUrl = mFile.url
        }
    } catch {
        //
    }

    // 선택지
    if (!Array.isArray(choices) || choices.length === 0) {
        return ApiUtils.badRequest("선택지 정보가 없습니다.")
    }

    const mGame = new MVersusGame({
        title: title,
        content: content,
        userId: session?.user?._id,
        thumbnailImageId: thumbnailImageId,
        thumbnailImageUrl: thumbnailImageUrl,
        choices: choices,
    })

    try {
        const resultGame = await mGame.save()

        return ApiUtils.response(resultGame)
    } catch (err: any) {
        console.log("에러", err)
        return ApiUtils.serverError(err)
    }
}
