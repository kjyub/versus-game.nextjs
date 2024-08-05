"use client"

import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import * as VS from "@/styles/VersusStyles"
// import VersusMainSearch from "@/components/versus/VersusMainSearch"
import { MVersusGame } from "@/models/versus/MVersusGame"
import { useState, useEffect } from "react"
import VersusGame from "@/types/versus/VersusGame"
import CommonUtils from "@/utils/CommonUtils"
import { useRouter, useSearchParams } from "next/navigation"
import ApiUtils from "@/utils/ApiUtils"
import { useSession } from "next-auth/react"
import User from "@/types/user/User"
import { useUser } from "@/hooks/useUser"
import { GameState, PrivacyTypeIcons, PrivacyTypeNames } from "@/types/VersusTypes"
import { UserRole } from "@/types/UserTypes"
import { useInView } from "react-intersection-observer"
import { IPaginationResponse } from "@/types/common/Responses"

const PAGE_SIZE = 50

interface IVersusList {
    versusGameData: IPaginationResponse
}
export default function VersusList({ versusGameData }: IVersusList) {
    const router = useRouter()

    const user = useUser()
    const [games, setGames] = useState<Array<VersusGame>>([])

    const searchParams = useSearchParams()
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [itemCount, setItemCount] = useState<number>(0)
    const [maxPage, setMaxPage] = useState<number>(0)
    const [scrollRef, scrollInView] = useInView()
    const [isScrollLoading, setScrollLoading] = useState<boolean>(false)

    useEffect(() => {
        // 맨 위의 아이템이 보이면 업데이트
        if (scrollInView && games.length >= PAGE_SIZE - 3 && pageIndex + 1 <= maxPage) {
            getNextPage()
        }
    }, [scrollInView])

    useEffect(() => {
        // SSR 데이터는 1페이지만 불러온다.
        if (!Array.isArray(versusGameData.items)) {
            return
        }

        let newGames: Array<VersusGame> = []

        versusGameData.items.map((data) => {
            const game = new VersusGame()
            game.parseResponse(data)

            newGames.push(game)
        })

        setGames(newGames)
        setPageIndex(1)
        setItemCount(versusGameData.itemCount)
        setMaxPage(versusGameData.maxPage)
    }, [versusGameData])

    const getNextPage = async () => {
        if (isScrollLoading) {
            return
        }

        setScrollLoading(true)

        let params = {
            pageIndex: pageIndex + 1
        }

        const search = searchParams.get("search")
        if (!CommonUtils.isStringNullOrEmpty(search)) {
            params["search"] = search
        }
        const myGames = searchParams.get("myGames")
        if (!CommonUtils.isStringNullOrEmpty(myGames)) {
            params["myGames"] = 1
        }
        
        if (!CommonUtils.isStringNullOrEmpty(user.id)) {
            params["userId"] = user.id
        }

        const [bResult, statusCode, response] = await ApiUtils.request(
            "/api/versus/game",
            "GET",
            params,
        )

        if (!bResult) {
            setScrollLoading(false)
            return
        }

        const pagination: IPaginationResponse = response
        const items = pagination.items

        let newGames: Array<VersusGame> = []
        items.map((data) => {
            const game = new VersusGame()
            game.parseResponse(data)

            newGames.push(game)
        })

        setPageIndex(pageIndex + 1)
        setGames([...games, ...newGames])
        setItemCount(pagination.itemCount)
        setMaxPage(pagination.maxPage)

        setScrollLoading(false)
    }

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
            <VS.ListGameLoadingBox $is_active={isScrollLoading} ref={scrollRef}></VS.ListGameLoadingBox>
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
                <span className="title">
                    {game.title}
                    {game.state === GameState.BLOCK && (
                        <span className="ml-auto text-stone-300 text-sm font-normal">관리자에 의한 차단</span>
                    )}
                </span>
                <span className="content">{game.content}</span>
            </VS.ListGameContentBox>
            <VS.ListGameControlBox>
                {/* 게임 정보 */}
                <div className="box">
                    {(user.userRole === UserRole.STAFF || isMaster) && (
                        <VS.ListGamePrivacy>
                            {PrivacyTypeIcons[game.privacyType]}
                            <span className="value">{PrivacyTypeNames[game.privacyType]}</span>
                        </VS.ListGamePrivacy>
                    )}
                </div>
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
