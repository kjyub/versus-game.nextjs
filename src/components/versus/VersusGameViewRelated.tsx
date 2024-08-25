"use client"

import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import * as VS from "@/styles/VersusStyles"
import { useCallback, useEffect, useState } from "react"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import ApiUtils from "@/utils/ApiUtils"
import CommonUtils from "@/utils/CommonUtils"
import VersusGame from "@/types/versus/VersusGame"
import VersusGameComment from "@/types/versus/VersusGameComment"
import { IPaginationResponse } from "@/types/common/Responses"
import VersusCommentPagination from "./VersusCommentPagination"
import { Dictionary } from "@/types/common/Dictionary"
import { useSession } from "next-auth/react"
import User from "@/types/user/User"
import { EditStateTypes } from "@/types/DataTypes"
import StyleUtils from "@/utils/StyleUtils"
import VersusGameBox from "./VersusGameBox"
import { useRouter } from "next/navigation"

const PAGE_SIZE = 5

interface IVersusGameViewRelated {
    game: VersusGame
    user: User
    isShowResult: boolean
}
export default function VersusGameViewRelated({ game, user, isShowResult }: IVersusGameViewRelated) {
    const router = useRouter()

    const [relatedGames, setRelatedGames] = useState<Array<VersusGame>>([])

    useEffect(() => {
        setRelatedGames(game.relatedGames.filter(rg => rg.id !== game.id))
    }, [game])

    const handleLink = (link: string) => {
        router.push(link)
    }

    return (
        <VS.GameViewRelatedLayout $is_show={isShowResult}>
            <span className="title">연관 게임</span>
            <VS.GameViewRelatedList>
                {relatedGames.map((relatedGame: VersusGame, index: number) => (
                    <VersusGameBox 
                        key={index} 
                        game={relatedGame} 
                        user={user} 
                        goLink={handleLink} 
                    />
                ))}
            </VS.GameViewRelatedList>
        </VS.GameViewRelatedLayout>
    )
}
