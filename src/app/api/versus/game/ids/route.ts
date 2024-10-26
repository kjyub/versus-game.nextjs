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
import { GameState, PrivacyTypes, ThumbnailImageTypes } from "@/types/VersusTypes"
import CommonUtils from "@/utils/CommonUtils"
import MUser from "@/models/user/MUser"
import { UserRole } from "@/types/UserTypes"
import mongoose, { mongo } from "mongoose"
import MVersusGameView from "@/models/versus/MVersusGameView"
import MVersusGameAnswer from "@/models/versus/MVersusGameAnswer"
import { IPaginationResponse } from "@/types/common/Responses"
import GameUtils from "@/utils/GameUtils"

export async function GET(req: NextRequest) {
    await DBUtils.connect()

    const gameAll = await MVersusGame.find({ isDeleted: false })

    const gameIds = gameAll.map((game) => String(game.nanoId))

    const result: IPaginationResponse = gameIds

    return ApiUtils.response(result)
}