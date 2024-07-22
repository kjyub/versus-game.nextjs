import DBUtils from "@/utils/DBUtils"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import ApiUtils from "@/utils/ApiUtils"
import { NextApiRequest } from "next"
import MVersusGame from "@/models/versus/MVersusGame"
import { auth } from "@/auth"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import MFile from "@/models/file/MFile"
import CommonUtils from "@/utils/CommonUtils"

export async function GET(req: NextRequest, { params }: { id: string }) {
    const { id } = params

    // const session = await auth()
    // // 유저 확인
    // if (CommonUtils.isNullOrUndefined(session.user)) {
    //     return ApiUtils.notAuth()
    // }
    // console.log(session)

    await DBUtils.connect()
    const mGame = await MVersusGame.findOne({ nanoId: id, isDeleted: false })

    // if (mGame["userId"] !== session?.user._id) {
    //     return ApiUtils.notAuth()
    // }

    return ApiUtils.response(mGame)
}

export async function PUT(req: NextRequest, { params }: { id: string }) {
    const { id } = params
    const { title, content, thumbnailImageId, thumbnailImageType, privacyType, choices, choiceCountType } =
        await req.json()

    await DBUtils.connect()

    const session = await auth()

    // 유저 확인
    if (!session.user) {
        return ApiUtils.notAuth()
    }

    let mGame = await MVersusGame.findOne({ nanoId: id })

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

    mGame.title = title
    mGame.content = content
    mGame.userId = session?.user?._id
    mGame.thumbnailImageId = thumbnailImageId
    mGame.thumbnailImageUrl = thumbnailImageUrl
    mGame.thumbnailImageType = thumbnailImageType
    mGame.privacyType = privacyType
    mGame.choices = choices
    mGame.choiceCountType = choiceCountType

    try {
        const resultGame = await mGame.save()

        return ApiUtils.response(resultGame)
    } catch (err: any) {
        console.log("에러", err)
        return ApiUtils.serverError()
    }
}

export async function DELETE(req: NextRequest, { params }: { id: string }) {
    const { id } = params

    await DBUtils.connect()

    const session = await auth()

    // 유저 확인
    if (!session.user) {
        return ApiUtils.notAuth()
    }

    const mGame = await MVersusGame.findOne({ nanoId: id })

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
