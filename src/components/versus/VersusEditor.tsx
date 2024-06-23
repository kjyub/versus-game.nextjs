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
// import VersusMainSearch from "@/components/versus/VersusMainSearch"

const VersusMainSearch = dynamic(
    () => import("@/components/versus/VersusMainSearch"),
    { ssr: false },
)

enum ThumbnailType {
    IMAGE,
    TEXT,
}

export default function VersusEditor() {
    const [game, setGame] = useState<VersusGame>(new VersusGame())

    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [thumbnailType, setThumbnailType] = useState<ThumbnailType>(
        ThumbnailType.IMAGE,
    )

    useEffect(() => {
        game.title = title
    }, [title])

    useEffect(() => {
        game.content = content
    }, [content])

    const updateChoice = (index: number, choice: VersusGameChoice) => {
        game.updateChoice(index, choice)
    }

    const handleSave = () => {
        // console.log("choice: ", game, game.choices[1].title)
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
                        <div className="relative w-full h-48">
                            <VersusThumbnailImageEdit
                                isShow={thumbnailType === ThumbnailType.IMAGE}
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
