import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import * as VersusStyles from "@/styles/VersusStyles"
import dynamic from "next/dynamic"
import VersusEditor from "@/components/versus/VersusEditor"
import ApiUtils from "@/utils/ApiUtils"
import AuthUtils from "@/utils/AuthUtils"
import VersusGameView from "@/components/versus/VersusGameView"

const getGame = async (gameId: string) => {
    const [bResult, statusCode, response] = await ApiUtils.request(
        `/api/versus/game/${gameId}`,
        "GET",
    )

    return response
}

export default async function GamePage({ params }: { gameId: string }) {
    const { gameId } = params

    const gameData = await getGame(gameId)

    return <VersusGameView gameData={gameData} />
}
