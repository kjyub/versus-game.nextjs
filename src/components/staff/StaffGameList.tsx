"use client"

import VersusGame from "@/types/versus/VersusGame"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import { GameState, PrivacyTypes } from "@/types/VersusTypes"
import ApiUtils from "@/utils/ApiUtils"
import CommonUtils from "@/utils/CommonUtils"
import Image from "next/image"
import { useEffect, useState } from "react"
import * as SS from "@/styles/StaffStyles"

const PAGE_SIZE = 100

export default function StaffGameList() {
    const [games, setGames] = useState<Array<VersusGame>>([])

    const [pageIndex, setPageIndex] = useState<number>(1)
    const [itemCount, setItemCount] = useState<number>(0)
    const [maxPage, setMaxPage] = useState<number>(0)
    const [search, setSearch] = useState<string>("")
    const [searchValue, setSearchValue] = useState<string>("")

    useEffect(() => {
        getGameList(1, "")
    }, [])

    const getGameList = async (_pageIndex=1, _search="") => {
        const [bResult, statusCode, response] = await ApiUtils.request(
            `/api/versus/game`, 
            "GET",
            { pageIndex: _pageIndex, pageSize: PAGE_SIZE }
        )

        if (!bResult) {
            return
        }
        
        const pagination: IPaginationResponse = response

        let _games: Array<VersusGame> = []
        pagination.items.map(item => {
            const newGame = new VersusGame()
            newGame.parseResponse(item)
            _games.push(newGame)
        })
        setGames(_games)

        setPageIndex(pagination.pageIndex)
        setItemCount(pagination.itemCount)
        setMaxPage(pagination.maxPage)
    }

    return (
        <div className="flex flex-col w-full divide-y divide-stone-400">
            {/* 검색 */}
            <div className="">

            </div>

            {/* 리스트 */}
            {games.map((game: VersusGame, index: number) => (
                <Game key={index} game={game} />
            ))}
        </div>
    )
}

interface IGame {
    game: VersusGame
}
const Game = ({game}: IGame) => {
    const [state, setState] = useState<GameState>(GameState.NORMAL)
    const [privacyType, setPrivacyType] = useState<PrivacyTypes>(PrivacyTypes.PUBLIC)

    useEffect(() => {
        setState(game.state)
        setPrivacyType(game.privacyType)
    }, [game])

    const handleStateSave = async (_state: GameState) => {
        if (!confirm(`${game.title}의 상태를 변경하시겠습니까?`)) {
            return
        }

        const data = {
            state: _state,
            privacyType: privacyType
        }

        // 저장 성공 여부
        let saveResult: boolean = false 

        const [bResult, statusCode, response] = await ApiUtils.request(
            `/api/versus/game_state/${game.nanoId}`,
            "PUT",
            null,
            data,
        )

        if (!bResult) {
            if (response["message"]) {
                alert(response["message"])
            } else {
                alert("저장 실패했습니다.")
            }

            return
        }
        
        setState(_state)
    }

    const handlePrivacySave = async (_privacyType: PrivacyTypes) => {
        if (!confirm(`${game.title}의 상태를 변경하시겠습니까?`)) {
            return
        }

        const data = {
            state: state,
            privacyType: _privacyType
        }

        // 저장 성공 여부
        let saveResult: boolean = false 

        const [bResult, statusCode, response] = await ApiUtils.request(
            `/api/versus/game_state/${game.nanoId}`,
            "PUT",
            null,
            data,
        )

        if (!bResult) {
            if (response["message"]) {
                alert(response["message"])
            } else {
                alert("저장 실패했습니다.")
            }

            return
        }
        
        setPrivacyType(_privacyType)
    }

    return (
        <div className="flex flex-col w-full">
            {/* 헤더 */}
            <div className="flex items-center w-full h-28 p-2 space-x-2">
                {/* 썸네일 */}
                <div className="relative flex flex-center h-full aspect-[4/3] bg-stone-700">
                    {CommonUtils.isStringNullOrEmpty(game.thumbnailImageUrl) ? (
                        <span className="text-stone-400">이미지 없음</span>
                    ) : (
                        <Image src={ApiUtils.mediaUrl(game.thumbnailImageUrl)} fill alt={""} />
                    )}
                </div>
                
                {/* 내용 */}
                <div className="flex flex-col justify-start w-full h-full space-y-1">
                    {/* 1단 */}
                    <div className="flex w-full space-x-2">
                        <span className={`font-semibold ${state === GameState.BLOCK ? "text-red-500" : "text-stone-200"}`}>
                            {game.title}
                        </span>
                        <span className="text-stone-400">
                            {game.user.name} ({game.user.email})
                        </span>
                    </div>
                    {/* 2단 */}
                    <p className="text-stone-300 text-sm">
                        {game.content}
                    </p>
                </div>

                {/* 공개옵션 */}
                <div className="flex flex-col w-28 h-full space-y-1">
                    <span className="text-sm text-stone-300">
                        공개 옵션
                    </span>

                    <SS.GameStateButton 
                        $is_active={privacyType === PrivacyTypes.PUBLIC}
                        onClick={()=>{handlePrivacySave(PrivacyTypes.PUBLIC)}}
                    >
                        전체 공개
                    </SS.GameStateButton>
                    <SS.GameStateButton 
                        $is_active={privacyType === PrivacyTypes.RESTRICTED}
                        onClick={()=>{handlePrivacySave(PrivacyTypes.RESTRICTED)}}
                    >
                        일부 공개
                    </SS.GameStateButton>
                    <SS.GameStateButton 
                        $is_active={privacyType === PrivacyTypes.PRIVATE}
                        onClick={()=>{handlePrivacySave(PrivacyTypes.PRIVATE)}}
                    >
                        비공개
                    </SS.GameStateButton>
                </div>
                {/* 상태변경 */}
                <div className="flex flex-col w-28 h-full space-y-1">
                    <span className="text-sm text-stone-300">
                        게임 상태
                    </span>

                    <SS.GameStateButton 
                        $is_active={state === GameState.NORMAL}
                        onClick={()=>{handleStateSave(GameState.NORMAL)}}
                    >
                        정상
                    </SS.GameStateButton>
                    <SS.GameStateButton 
                        $is_active={state === GameState.BLOCK}
                        onClick={()=>{handleStateSave(GameState.BLOCK)}}
                    >
                        차단
                    </SS.GameStateButton>
                    {/* <SS.GameStateButton 
                        $is_active={state === GameState.STOP}
                        onClick={()=>{handleStateSave(GameState.STOP)}}
                    >
                        정지
                    </SS.GameStateButton> */}
                </div>
            </div>

            {/* 선택지 */}
            <div className="grid max-sm:grid-cols-2 max-xl:grid-cols-5 xl:grid-cols-10 w-full p-2 divide-x divide-y divide-stone-700">
                {game.choices.map((choice: VersusGameChoice, index: number) => (
                    <div
                        key={index} 
                        className="flex flex-col items-center w-full"
                    >
                        {/* 이미지 */}
                        <div className="relative flex flex-center w-full max-w-[12rem] aspect-[4/3] bg-stone-800">
                            {CommonUtils.isStringNullOrEmpty(choice.imageUrl) ? (
                                <span className="text-stone-400">이미지 없음</span>
                            ) : (
                                <Image src={ApiUtils.mediaUrl(choice.imageUrl)} fill alt={""} />
                            )}
                        </div>
                        {/* 내용 */}
                        <div className="flex flex-col w-full h-16">
                            <span className={`${choice.title !== "" ? "text-stone-300" : "text-stone-600"}`}>
                                [{index + 1}] {choice.title}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}