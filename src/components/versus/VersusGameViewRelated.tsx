"use client"

import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import * as VS from "@/styles/VersusStyles"
import { ReactNode, useCallback, useEffect, useState } from "react"
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
import VersusGameSimpleBox from "./VersusGameSimpleBox"

const PAGE_SIZE = 5

interface IVersusGameViewRelated {
    game: VersusGame
    user: User
    isShowResult: boolean
    commentHelpBox: ReactNode
}
export default function VersusGameViewRelated({ game, user, isShowResult, commentHelpBox }: IVersusGameViewRelated) {
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
            <div className="flex justify-between items-center w-full">
                <span className="font-semibold text-lg text-stone-800">연관 게임</span>

                {!CommonUtils.isNullOrUndefined(commentHelpBox) && commentHelpBox}
            </div>
            <VS.GameViewRelatedList>
                {relatedGames.map((relatedGame: VersusGame, index: number) => (
                    <>
                        <div className="max-sm:block sm:hidden">
                            <VersusGameSimpleBox
                                key={index} 
                                game={relatedGame} 
                                user={user} 
                                goLink={handleLink} 
                            />
                        </div>
                        <div className="max-sm:hidden sm:block">
                            <VersusGameBox 
                                key={index} 
                                game={relatedGame} 
                                user={user} 
                                goLink={handleLink} 
                            />
                        </div>
                    </>
                ))}
            </VS.GameViewRelatedList>
        </VS.GameViewRelatedLayout>
    )
}
