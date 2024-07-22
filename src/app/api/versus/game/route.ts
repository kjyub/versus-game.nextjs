import DBUtils from "@/utils/DBUtils"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import ApiUtils from "@/utils/ApiUtils"
import { NextApiRequest } from "next"
import MVersusGame from "@/models/versus/MVersusGame"
import { auth } from "@/auth"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import MFile from "@/models/file/MFile"
import { nanoid } from "nanoid"
import AuthUtils from "@/utils/AuthUtils"
import { PrivacyTypes, ThumbnailImageTypes } from "@/types/VersusTypes"
import CommonUtils from "@/utils/CommonUtils"

export async function GET(req: NextRequest) {
    console.log("privacyType", req.nextUrl.searchParams, req.nextUrl.search)
    let filter = {
        isDeleted: false,
        privacyType: PrivacyTypes.PUBLIC,
    }

    const searchValue = req.nextUrl.searchParams.get("search")
    if (searchValue !== null) {
        filter["title"] = new RegExp(searchValue, "i")
    }
    
    const privacyType = req.nextUrl.searchParams.get("privacyType")
    // 공개 옵션 필터가 없는 경우 public으로만 검색한다.
    if (privacyType === null) {
        filter["privacyType"] = PrivacyTypes.PUBLIC
    } else {
        const session = await auth()
        let userId: string = AuthUtils.getUserOrGuestId(req, session)
        console.log("userId", userId)

        // 로그인 했으면 내 userId로 필터링 건다
        if (!CommonUtils.isStringNullOrEmpty(userId)) {
            filter["userId"] = userId
        }
    }

    await DBUtils.connect()
    const mGames = await MVersusGame.find(filter).sort({
        createdAt: -1,
    })

    return ApiUtils.response(mGames)
}

export async function POST(req: NextRequest) {
    const { title, content, thumbnailImageId, thumbnailImageType, privacyType, choices, choiceCountType } =
        await req.json()

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

    const nanoId = nanoid(11)
    const mGame = new MVersusGame({
        nanoId: nanoId,
        title: title,
        content: content,
        userId: session?.user?._id,
        thumbnailImageId: thumbnailImageId,
        thumbnailImageUrl: thumbnailImageUrl,
        thumbnailImageType: thumbnailImageType,
        privacyType: privacyType,
        choices: choices,
        choiceCountType: choiceCountType,
    })

    try {
        const resultGame = await mGame.save()

        return ApiUtils.response(resultGame)
    } catch (err: any) {
        console.log("에러", err)
        return ApiUtils.serverError(err)
    }
}
