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
import { CookieConsts } from "@/types/ApiTypes"
import StorageUtils from "@/utils/StorageUtils"
import StyleUtils from "@/utils/StyleUtils"
import { IRawData } from "@/types/CommonTypes"
import VersusGameBox from "./VersusGameBox"

const PAGE_SIZE = 50

interface IVersusList {
    versusGameData: IPaginationResponse
}
export default function VersusList({ versusGameData }: IVersusList) {
    const router = useRouter()

    const [gameRawData, setGameRawData] = useState<IRawData>({})
    const [rollbackScrollLocation, setRollbackScrollLocation] = useState<number>(-1) // 목록으로 되돌아 왔을 때 이동할 스크롤 위치

    const user = useUser()
    const [games, setGames] = useState<Array<VersusGame>>([])

    const searchParams = useSearchParams()
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [lastId, setLastId] = useState<string>("")
    const [itemCount, setItemCount] = useState<number>(0)
    const [maxPage, setMaxPage] = useState<number>(0)
    const [scrollRef, scrollInView] = useInView()
    const [isScrollLoading, setScrollLoading] = useState<boolean>(false)

    useEffect(() => {
        StyleUtils.rollbackScreen()
    }, [])

    useEffect(() => {
        // 맨 위의 아이템이 보이면 업데이트
        if (scrollInView && games.length >= PAGE_SIZE - 3) {
            getNextPage()
        }
    }, [scrollInView])

    useEffect(() => {
        // 목록으로 되돌아 왔을 때 이동할 스크롤 위치가 있다면 바로 이동한다.
        if (games.length > 0 && rollbackScrollLocation >= 0) {
            const page = document.getElementById("page-root")
            if (page) {
                page.scrollTo({
                    top: rollbackScrollLocation,
                })
            }
        }
    }, [games, rollbackScrollLocation])

    useEffect(() => {
        // SSR 데이터는 1페이지만 불러온다.
        if (!Array.isArray(versusGameData.items)) {
            return
        }

        if (rollbackRawData()) {
            return
        }

        const newGames: Array<VersusGame> = convertGameDataToGame(versusGameData.items)

        setGames(newGames)
        setPageIndex(1)
        let _lastId: string = ""
        if (newGames.length > 0) {
            _lastId = newGames[newGames.length - 1].id
        } else {
            _lastId = ""
        }
        setLastId(_lastId)
        setItemCount(versusGameData.itemCount)
        setMaxPage(versusGameData.maxPage)

        // 뒤로가기로 돌아왔을 때 사용할 데이터 설정
        updateRawData([], _lastId, versusGameData.items)
        // 페이지를 처음 들어온 경우 이전 기억을 지운다.
        sessionStorage.removeItem(CookieConsts.GAME_LIST_DATA_SESSION)
    }, [versusGameData])

    // Api에서 게임 데이터를 게임 객체로 변환
    const convertGameDataToGame = (gameData: Array<object>): Array<VersusGame> => {
        // 유저가 게임을 조회, 참여 했는지를 임시로 저장해서 확인한다.
        // 뒤로가기 처럼 다시 리스트 조회 시 매번 api 요청하지 않기 때문에 최적화를 위함.
        const gameViewsCache: Array<string> = StorageUtils.getSessionStorageList(CookieConsts.GAME_VIEWED_SESSION)
        const gameViewsCacheSet: Set<string> = new Set(gameViewsCache)
        const gameChoicesCache: Array<string> = StorageUtils.getSessionStorageList(CookieConsts.GAME_CHOICED_SESSION)
        const gameChoicesCacheSet: Set<string> = new Set(gameChoicesCache)

        let newGames: Array<VersusGame> = []

        gameData.map((data) => {
            const game = new VersusGame()
            game.parseResponse(data)

            if (gameViewsCacheSet.has(game.nanoId)) {
                game.isView = true
            }
            if (gameChoicesCacheSet.has(game.nanoId)) {
                game.isChoice = true
            }

            newGames.push(game)
        })

        return newGames
    }

    const getNextPage = async () => {
        if (isScrollLoading) {
            return
        }
        // 게임들이 이미 한번 이상 로딩되었는데 lastId가 없으면 에러 혹은 페이지 끝이라고 간주
        if (pageIndex > 1 && CommonUtils.isStringNullOrEmpty(lastId)) {
            return
        }

        setScrollLoading(true)

        let params = {
            // pageIndex: pageIndex + 1
            lastId: lastId
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

        const newGames: Array<VersusGame> = convertGameDataToGame(items)

        setPageIndex(pageIndex + 1)
        setLastId(pagination.lastId)
        setGames([...games, ...newGames])
        setItemCount(pagination.itemCount)
        setMaxPage(pagination.maxPage)

        // 뒤로가기로 돌아왔을 때 사용할 데이터 설정
        updateRawData(gameRawData.items, pagination.lastId, items)

        setScrollLoading(false)
    }
    
    // 뒤로가기로 돌아왔을 때 사용할 데이터 업데이트
    const updateRawData = (rawDataItems: IRawData = [], lastId:string, newDataItems: Array<object>) => {
        let scrollLocation = 0
        const page = document.getElementById("page-root")
        if (page) {
            scrollLocation = page.scrollHeight
        }

        const newRawData: IRawData = {
            lastId: lastId,
            items: [...rawDataItems, ...newDataItems],
            scrollLocation: scrollLocation,
        }

        setGameRawData(newRawData)
    }

    // 현재 목록 상태를 세션스토리지에 저장한다.
    const memoryRawData = (_game: VersusGame) => {
        let scrollLocation = 0
        const page = document.getElementById("page-root")
        if (page) {
            scrollLocation = page.scrollTop
        }

        const newRawData: IRawData = {
            ...gameRawData,
            scrollLocation: scrollLocation,
        }

        setGameRawData(newRawData)

        const jsonData = JSON.stringify(newRawData)
        sessionStorage.setItem(CookieConsts.GAME_LIST_DATA_SESSION, jsonData)
    }

    // 리스트 상태를 이전 상태로 되돌린다.
    const rollbackRawData = (): boolean => {
        const jsonData = sessionStorage.getItem(CookieConsts.GAME_LIST_DATA_SESSION)

        if (CommonUtils.isStringNullOrEmpty(jsonData)) {
            return false
        }

        const _rawData: IRawData = JSON.parse(jsonData)
        const newGames: Array<VersusGame> = convertGameDataToGame(_rawData.items)

        setGames(newGames)
        setPageIndex(1)
        setLastId(_rawData.lastId)
        setItemCount(0)
        setMaxPage(0)

        // 뒤로가기로 돌아왔을 때 사용할 데이터 설정
        updateRawData([], _rawData.lastId, _rawData.items)
        setRollbackScrollLocation(_rawData.scrollLocation)
        
        return true
    }

    const handleLink = (link: string) => {
        router.push(link)
    }

    const handleTop = () => {
        const page = document.getElementById("page-root")
        if (page) {
            page.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        }
    }

    return (
        <VS.ListLayout>
            <VS.ListGrid>
                {games.map((game: VersusGame, index: number) => (
                    <VersusGameBox
                        key={index}
                        game={game}
                        user={user}
                        goLink={handleLink}
                        memoryRawData={memoryRawData}
                    />
                ))}
            </VS.ListGrid>
            <VS.ListGameLoadingBox $is_active={isScrollLoading} ref={scrollRef}></VS.ListGameLoadingBox>
            <VS.ListScrollTopButton onClick={() => {handleTop()}}>
                <i className="fa-solid fa-chevron-up"></i>
            </VS.ListScrollTopButton>
        </VS.ListLayout>
    )
}
