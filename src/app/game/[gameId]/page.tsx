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

const getGame = async (gameId: string) => {
    const [bResult, statusCode, response] = await ApiUtils.request(
        `/api/versus/game/${gameId}`,
        "GET",
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
    const { gameId } = params

    const gameData = await getGame(gameId)

    return (
        <VersusGameView gameData={gameData} />
    )
}
