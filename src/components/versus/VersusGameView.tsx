"use client"

import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import * as VersusStyles from "@/styles/VersusStyles"
import dynamic from "next/dynamic"
import { VersusInputText, VersusInputTextArea } from "./inputs/VersusInputs"
import { useEffect, useState } from "react"
import VersusGame from "@/types/versus/VersusGame"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import VersusFile from "@/types/file/VersusFile"
import ApiUtils from "@/utils/ApiUtils"
import { useRouter } from "next/navigation"
import CommonUtils from "@/utils/CommonUtils"
import { useSession } from "next-auth/react"
import VersusChoiceView from "./inputs/VersusChoiceView"

interface IVersusGameView {
    gameData: object | null
}
export default function VersusGameView({ gameData = null }: IVersusGameView) {
    const router = useRouter()
    const session = useSession()

    const [game, setGame] = useState<VersusGame>(new VersusGame())
    const [selectedChoice, setSelectedChoice] = useState<VersusGameChoice>(
        new VersusGameChoice(),
    ) // 선택할 예정인 선택지
    const [answerChoice, setAnswerChoice] = useState<VersusGameChoice>(
        new VersusGameChoice(),
    ) // 선택 확정한 선택지
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
    }, [gameData, session.status])

    // 업데이트 모드 시 불러온 게임 데이터를 이용해 초기화
    const updateGameInit = async (data: object) => {
        // 세션 불러오는 중에는 넘어가기
        if (
            CommonUtils.isNullOrUndefined(session) ||
            session.status === "loading"
        ) {
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

        // 유저가 선택한 선택지가 있는지 불러온다.
        const [bResult, statusCode, response] = await ApiUtils.request(
            `/api/versus/game_choice/${_game.nanoId}`,
            "GET",
        )
        if (bResult) {
            const answerId = response.gameChoiceId
            let answer = new VersusGameChoice()

            for (let i = 0; i < _game.choices.length; i++) {
                const _choice: VersusGameChoice = _game.choices[i]

                if (_choice.id === answerId) {
                    answer = _choice
                    setShowResult(true)
                    break
                }
            }

            setSelectedChoice(answer)
            setAnswerChoice(answer)
        }

        setMyAnswerLoading(false)

        // 조회수 증가
        ApiUtils.request(
            `/api/versus/game_view_count/${_game.nanoId}`,
            "POST",
        ).then((result) => {
            const [bResult, statusCode, response] = result
            //
        })
    }

    const handleSelectChoice = (choice: VersusGameChoice) => {
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

        const [bResult, statusCode, response] = await ApiUtils.request(
            "/api/versus/game_choice",
            "POST",
            null,
            data,
        )
        setAnswerChoice(selectedChoice)
        setShowResult(true)
    }
    const handleReset = () => {
        if (isShowResult) {
            // 이미 선택을 한 경우
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
                    selectChoice={handleSelectChoice}
                    selectedChoice={selectedChoice}
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

            <VersusStyles.GameViewCommentLayout>
                <span className="title">댓글</span>
            </VersusStyles.GameViewCommentLayout>
        </VersusStyles.GameViewLayout>
    )
}
