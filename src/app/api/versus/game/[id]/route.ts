import DBUtils from "@/utils/DBUtils"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import ApiUtils from "@/utils/ApiUtils"
import { NextApiRequest } from "next"
import MVersusGame from "@/models/versus/MVersusGame"
import { auth } from "@/auth"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import MFile from "@/models/file/MFile"

export async function GET(req: NextApiRequest, { params }: { id: string }) {
    const { id } = params

    const mGame = await MVersusGame.findOne({ _id: id, isDeleted: false })

    return ApiUtils.response(mGame)
}

export async function PUT(req: NextApiRequest, { params }: { id: string }) {
    const { id } = params
    const { title, content, thumbnailImageId, choices } = await req.json()

    await DBUtils.connect()

    const session = await auth()

    // 유저 확인
    if (!session.user) {
        return ApiUtils.notAuth()
    }

    const mGame = await MVersusGame.findOne({ _id: id })

    if (mGame["userId"] !== session?.user._id) {
        return ApiUtils.notAuth()
    }

    // 썸네일
    let thumbnailImageUrl = ""
    try {
        const mFile = await MFile.findOne({ _id: thumbnailImageId })
        if (mFile) {
            thumbnailImageUrl = mFile.url
        }
    } catch (err) {
        //
        console.log(err)
    }

    // 선택지
    if (!Array.isArray(choices) || choices.length === 0) {
        return ApiUtils.badRequest("선택지 정보가 없습니다.")
    }

    const gameData = {
        title: title,
        content: content,
        userId: session?.user?._id,
        thumbnailImageId: thumbnailImageId,
        thumbnailImageUrl: thumbnailImageUrl,
        choices: choices,
    }

    Object.assign(mGame, gameData)

    try {
        const resultGame = await mGame.save()

        return ApiUtils.response(resultGame)
    } catch (err: any) {
        console.log("에러", err)
        return ApiUtils.serverError()
    }
}

export async function DELETE(req: NextApiRequest, { params }: { id: string }) {
    const { id } = params

    await DBUtils.connect()

    const session = await auth()

    // 유저 확인
    if (!session.user) {
        return ApiUtils.notAuth()
    }

    const mGame = await MVersusGame.findOne({ _id: id })

    if (mGame["userId"] !== session?.user._id) {
        return ApiUtils.notAuth()
    }

    const gameData = {
        isDeleted: true,
    }

    Object.assign(mGame, gameData)

    try {
        const resultGame = await mGame.save()

        return ApiUtils.response(resultGame)
    } catch (err: any) {
        console.log("에러", err)
        return ApiUtils.serverError()
    }
}
