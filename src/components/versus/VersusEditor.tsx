"use client"

import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import * as VersusStyles from "@/styles/VersusStyles"
import dynamic from "next/dynamic"
import { VersusInputText, VersusInputTextArea } from "./inputs/VersusInputs"
import { useEffect, useState } from "react"
import VersusThumbnailImageEdit from "./inputs/VersusThumbnailImageEdit"
import VersusChoiceEdit from "./inputs/VersusChoiceEdit"
import VersusGame from "@/types/versus/VersusGame"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import VersusFile from "@/types/file/VersusFile"
import ApiUtils from "@/utils/ApiUtils"
import { useRouter } from "next/navigation"
import CommonUtils from "@/utils/CommonUtils"
// import VersusMainSearch from "@/components/versus/VersusMainSearch"

const VersusMainSearch = dynamic(
    () => import("@/components/versus/VersusMainSearch"),
    { ssr: false },
)

enum ThumbnailType {
    IMAGE,
    TEXT,
}

interface IVersusEditor {
    isUpdate: boolean
    gameData: object | null
}
export default function VersusEditor({
    isUpdate = false,
    gameData = null,
}: IVersusEditor) {
    const router = useRouter()

    const [game, setGame] = useState<VersusGame>(new VersusGame())

    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [thumbnailType, setThumbnailType] = useState<ThumbnailType>(
        ThumbnailType.IMAGE,
    )

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
    }, [isUpdate, gameData])

    useEffect(() => {
        game.title = title
    }, [title])

    useEffect(() => {
        game.content = content
    }, [content])

    // 업데이트 모드 시 불러온 게임 데이터를 이용해 초기화
    const updateGameInit = (data: object) => {
        if (!isUpdate || CommonUtils.isNullOrUndefined(data)) {
            return
        }

        const _game = new VersusGame()
        _game.parseResponse(data)

        if (CommonUtils.isStringNullOrEmpty(_game.id)) {
            alert("데이터가 잘못되었습니다")
            return
        }

        setGame(_game)
        setTitle(_game.title)
        setContent(_game.content)
    }

    const updateThumbnail = (file: VersusFile) => {
        game.thumbnailImageId = file.id
        game.thumbnailImageUrl = file.url
    }

    const updateChoice = (index: number, choice: VersusGameChoice) => {
        game.updateChoice(index, choice)
    }

    const handleSave = async () => {
        const data = {
            title: game.title,
            content: game.content,
            thumbnailImageId: game.thumbnailImageId,
            choices: game.choices.map((_c) => _c.parseRequest()),
        }

        if (CommonUtils.isStringNullOrEmpty(game.id)) {
            const [bResult, statusCode, response] = await ApiUtils.request(
                "/api/versus/game",
                "POST",
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

            const newGame = new VersusGame()
            newGame.parseResponse(response)

            if (!newGame.isEmpty()) {
                router.push("/")
            }
        } else {
            const [bResult, statusCode, response] = await ApiUtils.request(
                `/api/versus/game/${game.id}`,
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
            router.push("/")
        }
    }

    return (
        <VersusStyles.EditorLayout>
            <VersusStyles.EditorDataLayout>
                <VersusStyles.EditInfoBox>
                    <span className="title">기본 정보</span>

                    {/* 제목 */}
                    <VersusInputText
                        label={"제목"}
                        placeholder={"제목을 입력해주세요."}
                        value={title}
                        setValue={setTitle}
                    />

                    {/* 썸네일 */}
                    <VersusStyles.InputContainer>
                        <VersusStyles.InputTitle className="mb-2">
                            썸네일
                        </VersusStyles.InputTitle>
                        <VersusStyles.InputTypeButtonList>
                            <VersusStyles.InputTypeButton
                                $is_show={thumbnailType === ThumbnailType.IMAGE}
                                onClick={() => {
                                    setThumbnailType(ThumbnailType.IMAGE)
                                }}
                            >
                                이미지 썸네일
                            </VersusStyles.InputTypeButton>
                            <VersusStyles.InputTypeButton
                                $is_show={thumbnailType === ThumbnailType.TEXT}
                                onClick={() => {
                                    setThumbnailType(ThumbnailType.TEXT)
                                }}
                            >
                                텍스트 썸네일
                            </VersusStyles.InputTypeButton>
                        </VersusStyles.InputTypeButtonList>
                        <div className="relative w-full max-lg:h-56 max-2xl:h-72 2xl:h-56">
                            <VersusThumbnailImageEdit
                                isShow={thumbnailType === ThumbnailType.IMAGE}
                                oldImageId={game.thumbnailImageId}
                                updateThumbnail={updateThumbnail}
                            />
                        </div>
                    </VersusStyles.InputContainer>

                    {/* 내용 */}
                    <VersusInputTextArea
                        label={"내용"}
                        placeholder={"게임에 대한 내용을 입력해주세요.(선택)"}
                        value={content}
                        setValue={setContent}
                        rows={8}
                    />
                </VersusStyles.EditInfoBox>
                <VersusStyles.EditChoiceBox>
                    <span className="title">선택지</span>
                    <VersusChoiceEdit game={game} updateChoice={updateChoice} />
                </VersusStyles.EditChoiceBox>
            </VersusStyles.EditorDataLayout>

            <VersusStyles.EditorControlLayout>
                <VersusStyles.EditorControlButton
                    onClick={() => {
                        handleSave()
                    }}
                >
                    저장
                </VersusStyles.EditorControlButton>
            </VersusStyles.EditorControlLayout>
        </VersusStyles.EditorLayout>
    )
}
