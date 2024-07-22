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
import { useSession } from "next-auth/react"
import { PrivacyTypeIcons, PrivacyTypeNames, PrivacyTypes, ThumbnailImageTypes } from "@/types/VersusTypes"
import ModalContainer from "../ModalContainer"
import VersusPrivacyModal from "./modals/VersusPrivacyModal"
// import VersusMainSearch from "@/components/versus/VersusMainSearch"

const VersusMainSearch = dynamic(
    () => import("@/components/versus/VersusMainSearch"),
    { ssr: false },
)

interface IVersusEditor {
    isUpdate: boolean
    gameData: object | null
}
export default function VersusEditor({
    isUpdate = false,
    gameData = null,
}: IVersusEditor) {
    const router = useRouter()
    const session = useSession()

    const [game, setGame] = useState<VersusGame>(new VersusGame())

    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [thumbnailType, setThumbnailType] = useState<ThumbnailImageTypes>(
        ThumbnailImageTypes.IMAGE,
    )
    const [privacyType, setPrivacyType] = useState<PrivacyTypes>(
        PrivacyTypes.PUBLIC,
    )
    const [choiceCountType, setChoiceCountType] = useState<number>(200) // 백자리 수 부턴 선택 개수, 십자리 수 까진 개수별 레이아웃

    const [isShowPrivacy, setShowPrivacy] = useState<boolean>(false)

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
    }, [isUpdate, gameData, session.status])

    useEffect(() => {
        game.title = title
    }, [title])

    useEffect(() => {
        game.content = content
    }, [content])

    useEffect(() => {
        game.thumbnailType = thumbnailType
    }, [thumbnailType])
    
    useEffect(() => {
        game.privacyType = privacyType
    }, [privacyType])

    // 업데이트 모드 시 불러온 게임 데이터를 이용해 초기화
    const updateGameInit = (data: object) => {
        // 세션 불러오는 중에는 넘어가기
        if (
            CommonUtils.isNullOrUndefined(session) ||
            session.status === "loading"
        ) {
            return
        }
        // 로그인 안했으면 나가기
        if (session.status === "unauthenticated") {
            router.push("/")
            return
        }

        if (!isUpdate || CommonUtils.isNullOrUndefined(data)) {
            return
        }

        const _game = new VersusGame()
        _game.parseResponse(data)

        if (CommonUtils.isStringNullOrEmpty(_game.id)) {
            alert("데이터가 잘못되었습니다")
            return
        }

        // 작성자가 아니면 권한 X
        if (isUpdate && session.data?.user?._id !== _game.userId) {
            alert("권한이 없습니다")
            router.push("/")
            return
        }

        setGame(_game)
        setTitle(_game.title)
        setContent(_game.content)
        setChoiceCountType(_game.choiceCountType)
        setThumbnailType(_game.thumbnailImageType)
        setPrivacyType(_game.privacyType)
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
            thumbnailImageType: game.thumbnailType,
            privacyType: game.privacyType,
            choices: game.choices.map((_c) => _c.parseRequest()),
            choiceCountType: choiceCountType,
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
                `/api/versus/game/${game.nanoId}`,
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

    const handleDelete = async () => {
        const [bResult, statusCode, response] = await ApiUtils.request(
            `/api/versus/game/${game.nanoId}`,
            "DELETE",
            null,
        )

        if (!bResult) {
            if (response["message"]) {
                alert(response["message"])
            } else {
                alert("삭제 실패했습니다.")
            }

            return
        }
        router.push("/")
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
                                $is_show={
                                    thumbnailType === ThumbnailImageTypes.IMAGE
                                }
                                onClick={() => {
                                    setThumbnailType(ThumbnailImageTypes.IMAGE)
                                }}
                            >
                                이미지 썸네일
                            </VersusStyles.InputTypeButton>
                            <VersusStyles.InputTypeButton
                                $is_show={
                                    thumbnailType === ThumbnailImageTypes.TEXT
                                }
                                onClick={() => {
                                    setThumbnailType(ThumbnailImageTypes.TEXT)
                                }}
                            >
                                텍스트 썸네일
                            </VersusStyles.InputTypeButton>
                        </VersusStyles.InputTypeButtonList>
                        <div className="relative w-full max-lg:h-56 max-2xl:h-72 2xl:h-56">
                            <VersusThumbnailImageEdit
                                isShow={
                                    thumbnailType === ThumbnailImageTypes.IMAGE
                                }
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
                    <VersusChoiceEdit
                        game={game}
                        updateChoice={updateChoice}
                        choiceCountType={choiceCountType}
                        setChoiceCountType={setChoiceCountType}
                    />
                </VersusStyles.EditChoiceBox>
            </VersusStyles.EditorDataLayout>

            <VersusStyles.EditorControlLayout>
                <VersusStyles.EditorControlButton
                    onClick={() => {
                        handleDelete()
                    }}
                >
                    삭제
                </VersusStyles.EditorControlButton>
                <div className="flex items-center space-x-2">
                    <VersusStyles.EditorPrivacySetButton
                        onClick={()=>{setShowPrivacy(true)}}
                    >
                        {PrivacyTypeIcons[privacyType]}
                        <div className="flex flex-col items-start">
                            <span className="title">공개 옵션</span>
                            <span className="value">{PrivacyTypeNames[privacyType]}</span>
                        </div>
                    </VersusStyles.EditorPrivacySetButton>
                    <VersusStyles.EditorControlButton
                        onClick={() => {
                            handleSave()
                        }}
                    >
                        저장
                    </VersusStyles.EditorControlButton>
                </div>
            </VersusStyles.EditorControlLayout>

            <ModalContainer
                isOpen={isShowPrivacy}
                setIsOpen={setShowPrivacy}
                isBlur={true}
            >
                <VersusPrivacyModal
                    privacyType={privacyType}
                    setPrivacyType={setPrivacyType}
                    close={()=>{setShowPrivacy(false)}}
                />
            </ModalContainer>
        </VersusStyles.EditorLayout>
    )
}