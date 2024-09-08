"use client"

import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import * as VS from "@/styles/VersusStyles"
// import VersusMainSearch from "@/components/versus/VersusMainSearch"
import { useState, useEffect } from "react"
import VersusGame from "@/types/versus/VersusGame"
import CommonUtils from "@/utils/CommonUtils"
import ApiUtils from "@/utils/ApiUtils"
import User from "@/types/user/User"
import { GameState, PrivacyTypeIcons, PrivacyTypeNames } from "@/types/VersusTypes"
import { UserRole } from "@/types/UserTypes"
import { CookieConsts } from "@/types/ApiTypes"
import StorageUtils from "@/utils/StorageUtils"


interface IGameBox {
    game: VersusGame
    user: User
    goLink: (gameId: string) => void
    memoryRawData: (_game: VersusGame) => void
}
export default function VersusGameSimpleBox({ game, user, goLink, memoryRawData }: IGameBox) {
    const isMaster = game.userId !== user.id
    const [isHover, setHover] = useState<boolean>(false)

    const handleGame = () => {
        StorageUtils.pushSessionStorageList(CookieConsts.GAME_VIEWED_SESSION, game.nanoId)

        if (!CommonUtils.isNullOrUndefined(memoryRawData)) {
            memoryRawData(game)
        }
        goLink(`/game/${game.nanoId}`)
    }

    const handleUpdate = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        goLink(`/game/update/${game.nanoId}`)
    }

    return (
        <VS.ListGameSimpleBox
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
            {!CommonUtils.isStringNullOrEmpty(game.thumbnailImageUrl) && (
                <VS.ListGameThumbnailBox className={`absolute z-0 top-1/2 -translate-y-1/2`}>
                    <Image
                        src={ApiUtils.mediaUrl(game.thumbnailImageUrl)}
                        className={`${isHover ? "hover" : ""}`}
                        alt={""}
                        fill
                    />
                </VS.ListGameThumbnailBox>
            )}
            <VS.ListGameSimpleContentBox $is_active={!CommonUtils.isStringNullOrEmpty(game.thumbnailImageUrl)}>
                <VS.ListGameContentBox>
                    <span className={`title ${game.isView ? "viewed" : ""}`}>
                        {/* 선택했었는지 여부 */}
                        {game.isChoice && (
                            <i 
                                title={"이미 선택한 게임입니다."}
                                className="fa-solid fa-circle-check text-indigo-400 mr-1"
                            />
                        )}
                        {/* 제목 */}
                        {game.title}
                        {/* 상태 */}
                        {game.state === GameState.BLOCK && (
                            <span className="ml-auto text-stone-300 text-sm font-normal">관리자에 의한 차단</span>
                        )}
                    </span>
                    <span className="content">{game.content}</span>
                </VS.ListGameContentBox>
            </VS.ListGameSimpleContentBox>
        </VS.ListGameSimpleBox>
    )
}
