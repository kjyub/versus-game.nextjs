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
import MUser from "@/models/user/MUser"
import { UserRole } from "@/types/UserTypes"

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
    const { state, privacyType } = await req.json()

    await DBUtils.connect()

    const session = await auth()

    // 유저 확인
    if (!session.user) {
        return ApiUtils.notAuth()
    }
    // 관리자 확인
    const mUser = await MUser.findOne({ _id: session.user._id})
    if (mUser.userRole !== UserRole.STAFF) {
        return ApiUtils.notAuth("권한이 없습니다.")
    }

    let mGame = await MVersusGame.findOne({ nanoId: id })

    mGame.state = state
    mGame.privacyType = privacyType

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
    // 관리자 확인
    let isStaff = false
    const mUser = await MUser.findOne({ _id: session.user._id})
    if (mUser.userRole === UserRole.STAFF) {
        isStaff = true
    }

    const mGame = await MVersusGame.findOne({ nanoId: id })

    if (mGame["userId"] !== session?.user._id && !isStaff) {
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
