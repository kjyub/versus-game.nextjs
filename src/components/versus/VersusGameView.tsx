"use client"

import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import * as VersusStyles from "@/styles/VersusStyles"
import dynamic from "next/dynamic"
import { VersusInputText, VersusInputTextArea } from "./inputs/VersusInputs"
import { useCallback, useEffect, useState } from "react"
import VersusGame from "@/types/versus/VersusGame"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import VersusFile from "@/types/file/VersusFile"
import ApiUtils from "@/utils/ApiUtils"
import { useRouter } from "next/navigation"
import CommonUtils from "@/utils/CommonUtils"
import { useSession } from "next-auth/react"
import VersusChoiceView from "./inputs/VersusChoiceView"
import { nanoid } from "nanoid"
import { Dictionary } from "@/types/common/Dictionary"
import VersusGameViewComment from "./VersusGameViewComment"
import StorageUtils from "@/utils/StorageUtils"
import { CookieConsts } from "@/types/ApiTypes"

const INIT_CHOICES = [
    new VersusGameChoice(),
    new VersusGameChoice(),
    new VersusGameChoice(),
    new VersusGameChoice(),
    new VersusGameChoice(),
    new VersusGameChoice(),
    new VersusGameChoice(),
    new VersusGameChoice(),
    new VersusGameChoice(),
    new VersusGameChoice(),
]

interface IVersusGameView {
    gameData: object | null
}
export default function VersusGameView({ gameData = null }: IVersusGameView) {
    const router = useRouter()
    const session = useSession()

    const [game, setGame] = useState<VersusGame>(new VersusGame())
    const [choices, setChoices] = useState<Array<VersusGameChoice>>(INIT_CHOICES)
    const [totalVotes, setTotalVotes] = useState<number>(0)

    // 선택할 예정인 선택지
    const [selectedChoice, setSelectedChoice] = useState<VersusGameChoice>(new VersusGameChoice())
    // 선택 확정한 선택지
    const [answerChoice, setAnswerChoice] = useState<VersusGameChoice>(new VersusGameChoice())

    const [isShowResult, setShowResult] = useState<boolean>(false)

    const [isMyAnswerLoading, setMyAnswerLoading] = useState<boolean>(true)

    useEffect(() => {
        // const handleBeforeUnload = (event) => {
        //     event.preventDefault()
        //     event.returnValue = "" // 이 줄은 일부 브라우저에서 필수입니다.
        // }
        // window.addEventListener("beforeunload", handleBeforeUnload)
        // window.addEventListener("popstate", handleBeforeUnload)
        // return () => {
        //     window.removeEventListener("beforeunload", handleBeforeUnload)
        //     window.removeEventListener("popstate", handleBeforeUnload)
        // }
    }, [])

    useEffect(() => {
        updateGameInit(gameData)
    }, [gameData, session.status, session])

    useEffect(() => {
        if (isShowResult) {
            getAnswerResults()
        }
    }, [isShowResult])

    // 업데이트 모드 시 불러온 게임 데이터를 이용해 초기화
    const updateGameInit = async (data: object) => {
        // 세션 불러오는 중에는 넘어가기
        if (CommonUtils.isNullOrUndefined(session) || session.status === "loading") {
            return
        }

        if (CommonUtils.isNullOrUndefined(data) || data === {}) {
            alert("게임을 찾을 수 없습니다")
            return
        }

        setMyAnswerLoading(true)
        const _game = new VersusGame()
        _game.parseResponse(data)

        if (CommonUtils.isStringNullOrEmpty(_game.id)) {
            alert("데이터가 잘못되었습니다")
            return
        }

        setGame(_game)
        setChoices(_game.choices)

        // 유저가 선택한 선택지가 있는지 불러온다.
        let isChoice: boolean = false
        const [bResult, statusCode, response] = await ApiUtils.request(`/api/versus/game_choice/${_game.nanoId}`, "GET")
        if (bResult) {
            const answerId = response.gameChoiceId
            let answer = new VersusGameChoice()

            for (let i = 0; i < _game.choices.length; i++) {
                const _choice: VersusGameChoice = _game.choices[i]

                // 선택한 선택지가 있으면 게임 결과 표시
                if (_choice.id === answerId) {
                    answer = _choice
                    isChoice = true
                    setShowResult(true)
                    break
                }
            }

            setSelectedChoice(answer)
            setAnswerChoice(answer)
        }

        if (!isChoice) {
            setShowResult(false)
            setSelectedChoice(new VersusGameChoice())
            setAnswerChoice(new VersusGameChoice())
        }

        setMyAnswerLoading(false)

        // 조회수 증가
        ApiUtils.request(`/api/versus/game_view_count/${_game.nanoId}`, "POST").then((result) => {
            const [bResult, statusCode, response] = result
            //
        })
    }

    const getAnswerResults = async () => {
        const [bResult, statusCode, response] = await ApiUtils.request("/api/versus/game_choice", "GET", {
            gameNanoId: game.nanoId,
        })

        if (!bResult) {
            return
        }

        // 데이터 정리
        const totalDatas: Array<object> = response["totalCount"] ?? []
        if (totalDatas.length === 0) {
            return
        }
        const totalData: Array<object> = totalDatas[0]
        const _totalVotes = totalData["total"] ?? 0
        const choicesData: Array<object> = response["choices"] ?? []
        if (choicesData.length === 0 || _totalVotes === 0) {
            return
        }

        setTotalVotes(_totalVotes)
        const choiceDic: Dictionary<string, number> = new Dictionary<string, number>()
        choicesData.map((choiceData) => {
            choiceDic.push(choiceData["_id"] ?? "", choiceData["count"] ?? 0)
        })

        // 선택지 결과 계산 및 값 설정
        let _choices = choices.map((_choice) => {
            if (choiceDic.contains(_choice.id)) {
                _choice.voteCount = choiceDic.getValue(_choice.id)
                _choice.voteRate = (_choice.voteCount / _totalVotes) * 100
            }

            return _choice
        })
        setChoices(_choices)
    }

    const handleSelectChoice = (choice: VersusGameChoice) => {
        if (isShowResult) {
            return
        }

        if (selectedChoice.id === choice.id) {
            setSelectedChoice(new VersusGameChoice())
        } else {
            setSelectedChoice(choice)
        }
    }

    const handleAnswer = async () => {
        if (CommonUtils.isStringNullOrEmpty(selectedChoice.id)) {
            alert("선택지를 선택해주세요.")
            return
        }

        const data = {
            gameId: game.id,
            gameAnswerId: selectedChoice.id,
        }

        const [bResult, statusCode, response] = await ApiUtils.request("/api/versus/game_choice", "POST", null, data)

        if (bResult) {
            setAnswerChoice(selectedChoice)
            setShowResult(true)

            StorageUtils.pushSessionStorageList(CookieConsts.GAME_CHOICED_SESSION, game.nanoId)
        } else {
            alert(response["message"] ?? "요청 실패했습니다.")
        }
    }
    const handleReset = () => {
        if (isShowResult) {
            // 이미 선택을 한 경우
            if (!confirm("선택을 취소하시겠습니까?")) {
                return
            }

            setAnswerChoice(new VersusGameChoice())
            setSelectedChoice(new VersusGameChoice())
            setShowResult(false)
        } else {
            // 처음 선택하는 경우
            setSelectedChoice(new VersusGameChoice())
        }
    }

    return (
        <VersusStyles.GameViewLayout>
            <VersusStyles.GameViewHeadLayout>
                <span className="title">{game.title}</span>
                <p className="content">{game.content}</p>
            </VersusStyles.GameViewHeadLayout>

            <VersusStyles.GameViewChoiceLayout>
                <VersusChoiceView
                    game={game}
                    choices={choices}
                    selectChoice={handleSelectChoice}
                    selectedChoice={selectedChoice}
                    isShowResult={isShowResult}
                />
            </VersusStyles.GameViewChoiceLayout>

            <VersusStyles.GameViewSelectLayout>
                <button
                    className="max-sm:w-20 sm:w-28 bg-stone-500/50 hover:bg-stone-600/50"
                    onClick={() => {
                        handleReset()
                    }}
                    disabled={isMyAnswerLoading}
                >
                    초기화
                </button>
                <button
                    className="flex-grow bg-indigo-600/70 hover:bg-indigo-700/70"
                    onClick={() => {
                        handleAnswer()
                    }}
                    disabled={isMyAnswerLoading || isShowResult}
                >
                    선택 후 결과 보기
                </button>
            </VersusStyles.GameViewSelectLayout>

            <VersusGameViewComment game={game} answerChoice={answerChoice} isShowResult={isShowResult} />
        </VersusStyles.GameViewLayout>
    )
}
