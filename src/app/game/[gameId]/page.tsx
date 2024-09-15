import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import * as VersusStyles from "@/styles/VersusStyles"
import dynamic from "next/dynamic"
import VersusEditor from "@/components/versus/VersusEditor"
import ApiUtils from "@/utils/ApiUtils"
import AuthUtils from "@/utils/AuthUtils"
import VersusGameView from "@/components/versus/VersusGameView"
import Head from "next/head"
import { Metadata } from "next"
import { auth } from "@/auth"
import CommonUtils from "@/utils/CommonUtils"

const getGame = async (gameId: string, userId: string) => {
    let params = {}

    if (!CommonUtils.isStringNullOrEmpty(userId)) {
        params["userId"] = userId
    }

    const [bResult, statusCode, response] = await ApiUtils.request(
        `/api/versus/game/${gameId}`,
        "GET",
        params,
    )

    return response
}
const getUserChoice = async (gameId: string, userId: string) => {
    const [bResult, statusCode, response] = await ApiUtils.request(
        `/api/versus/game_choice/${gameId}`,
        "POST",
        null,
        { userId: userId }
    )

    return Object.keys(response).length === 0 ? null : response
}
const countGameView = async (gameId: string, userId: string) => {
    const [bResult, statusCode, response] = await ApiUtils.request(
        `/api/versus/game_view_count/${gameId}`,
        "POST",
        null,
        { userId: userId }
    )

    return response
}

export async function generateMetadata({ params }: { gameId: string }): Promise<Metadata> {
    let gameTitle: string = "VS 게임 추즈밍"

    try {
        const { gameId } = params
    
        const gameData = await getGame(gameId)
        gameTitle = gameData["title"] + " - " + gameTitle
    } catch {
        //
    }

    return {
        title: gameTitle,
    }
}

export default async function GamePage({ params }: { gameId: string }) {
    const session = await auth()
    const userId: string = AuthUtils.getUserOrGuestIdBySSR(session)

    const { gameId } = params

    const gameData = await getGame(gameId, userId)
    const userChoiceData = await getUserChoice(gameId, userId)
    await countGameView(gameId, userId)

    return (
        <VersusGameView gameData={gameData} userChoiceData={userChoiceData} />
    )
}
