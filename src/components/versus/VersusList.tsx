"use client"

import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import * as VS from "@/styles/VersusStyles"
// import VersusMainSearch from "@/components/versus/VersusMainSearch"
import { MVersusGame } from "@/models/versus/MVersusGame"
import { useState, useEffect } from "react"
import VersusGame from "@/types/versus/VersusGame"
import CommonUtils from "@/utils/CommonUtils"
import { useRouter } from "next/navigation"
import ApiUtils from "@/utils/ApiUtils"
import { useSession } from "next-auth/react"
import User from "@/types/user/User"
import { useUser } from "@/hooks/useUser"

interface IVersusList {
    versusGameData: Array<object>
}
export default function VersusList({ versusGameData }: IVersusList) {
    const router = useRouter()

    const user = useUser()
    const [games, setGames] = useState<Array<VersusGame>>([])

    useEffect(() => {
        let newGames: Array<VersusGame> = []

        versusGameData.map((data) => {
            const game = new VersusGame()
            game.parseResponse(data)

            newGames.push(game)
        })

        setGames(newGames)
    }, [versusGameData])

    const handleLink = (link: string) => {
        router.push(link)
    }

    return (
        <VS.ListLayout>
            <VS.ListGrid>
                {games.map((game: VersusGame, index: number) => (
                    <GameBox
                        key={index}
                        game={game}
                        user={user}
                        goLink={handleLink}
                    />
                ))}
            </VS.ListGrid>
        </VS.ListLayout>
    )
}

interface IGameBox {
    game: VersusGame
    user: User
    goLink: (gameId: string) => void
}
const GameBox = ({ game, user, goLink }: IGameBox) => {
    const isMaster = game.userId === user.id
    const [isHover, setHover] = useState<boolean>(false)

    const handleGame = () => {
        goLink(`/game/${game.nanoId}`)
    }

    const handleUpdate = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        goLink(`/game/update/${game.nanoId}`)
    }

    return (
        <VS.ListGameBox
            onMouseEnter={() => {
                setHover(true)
            }}
            onMouseLeave={() => {
                setHover(false)
            }}
            className={`${isHover ? "hover" : ""}`}
            onClick={() => {
                handleGame()
            }}
        >
            <VS.ListGameThumbnailBox>
                {!CommonUtils.isStringNullOrEmpty(game.thumbnailImageUrl) ? (
                    <Image
                        src={ApiUtils.mediaUrl(game.thumbnailImageUrl)}
                        className={`${isHover ? "hover" : ""}`}
                        alt={""}
                        fill
                    />
                ) : (
                    "썸네일이 없습니다."
                )}
            </VS.ListGameThumbnailBox>
            <VS.ListGameContentBox>
                <span className="title">{game.title}</span>
                <span className="content">{game.content}</span>
            </VS.ListGameContentBox>
            <VS.ListGameControlBox>
                {/* 게임 정보 */}
                <div className="box"></div>
                {/* 게임 정보 (글쓴이) */}
                {isMaster && (
                    <div className="box">
                        <VS.ListGameControlButton onClick={handleUpdate}>
                            수정
                        </VS.ListGameControlButton>
                    </div>
                )}
            </VS.ListGameControlBox>
        </VS.ListGameBox>
    )
}
