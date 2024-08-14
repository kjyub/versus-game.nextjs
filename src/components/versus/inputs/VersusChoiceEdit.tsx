"use client"

import Image from "next/image"
import * as MainStyles from "@/styles/MainStyles"
import * as VS from "@/styles/VersusStyles"
import dynamic from "next/dynamic"
import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import VersusGame from "@/types/versus/VersusGame"
import ImageDragAndDrop from "@/components/commons/inputs/ImageDragAndDrop"
import VersusFile from "@/types/file/VersusFile"
import CommonUtils from "@/utils/CommonUtils"
import ApiUtils from "@/utils/ApiUtils"
import { CHOICE_COUNT_CONST } from "@/types/VersusTypes"
import StyleUtils from "@/utils/StyleUtils"

interface IVersusChoiceEdit {
    game: VersusGame
    updateChoice: (index: number, choice: VersusGameChoice) => void
    choiceCountType: number
    setChoiceCountType: Dispatch<SetStateAction<number>>
}
export default function VersusChoiceEdit({
    game,
    updateChoice,
    choiceCountType,
    setChoiceCountType,
}: IVersusChoiceEdit) {
    const [choiceCount, setChoiceCount] = useState<number>(0)
    const [layoutType, setLayoutType] = useState<number>(0)

    const [choices, setChoices] = useState<Array<VersusGameChoice>>([])

    useEffect(() => {
        updateOldChoices()
    }, [game])

    useEffect(() => {
        setChoiceCount(Math.floor(choiceCountType / CHOICE_COUNT_CONST))
        setLayoutType(choiceCountType % CHOICE_COUNT_CONST)
    }, [choiceCountType])

    const updateOldChoices = () => {
        if (
            CommonUtils.isStringNullOrEmpty(game.id) ||
            game.choices.length === 0
        ) {
            return
        }

        setChoices(game.choices)
    }

    return (
        <div className="flex flex-col w-full space-y-2 mt-2">
            <VS.InputTitle className="mb-2">선택지 개수</VS.InputTitle>
            <VS.InputTypeButtonList>
                <ChoiceCountTypeButton
                    count={2}
                    layoutCount={3}
                    choiceCountType={choiceCountType}
                    setChoiceCountType={setChoiceCountType}
                />
                <ChoiceCountTypeButton
                    count={3}
                    layoutCount={2}
                    choiceCountType={choiceCountType}
                    setChoiceCountType={setChoiceCountType}
                />
                <ChoiceCountTypeButton
                    count={4}
                    layoutCount={2}
                    choiceCountType={choiceCountType}
                    setChoiceCountType={setChoiceCountType}
                />
                <ChoiceCountTypeButton
                    count={5}
                    layoutCount={2}
                    choiceCountType={choiceCountType}
                    setChoiceCountType={setChoiceCountType}
                />
                <ChoiceCountTypeButton
                    count={6}
                    layoutCount={2}
                    choiceCountType={choiceCountType}
                    setChoiceCountType={setChoiceCountType}
                />
                <ChoiceCountTypeButton
                    count={7}
                    layoutCount={2}
                    choiceCountType={choiceCountType}
                    setChoiceCountType={setChoiceCountType}
                />
                <ChoiceCountTypeButton
                    count={8}
                    layoutCount={2}
                    choiceCountType={choiceCountType}
                    setChoiceCountType={setChoiceCountType}
                />
                <ChoiceCountTypeButton
                    count={9}
                    layoutCount={2}
                    choiceCountType={choiceCountType}
                    setChoiceCountType={setChoiceCountType}
                />
                <ChoiceCountTypeButton
                    count={10}
                    layoutCount={2}
                    choiceCountType={choiceCountType}
                    setChoiceCountType={setChoiceCountType}
                />
            </VS.InputTypeButtonList>
            <VS.ChoiceLayoutSettingContainer className="mt-4">
                <VS.ChoiceLayoutSettingGrid $choice_count={choiceCount}>
                    <ChoiceEdit
                        choiceCount={choiceCount}
                        index={0}
                        choice={game.choices[0]}
                        updateChoice={updateChoice}
                    />
                    <ChoiceEdit
                        choiceCount={choiceCount}
                        index={1}
                        choice={game.choices[1]}
                        updateChoice={updateChoice}
                    />
                    <ChoiceEdit
                        choiceCount={choiceCount}
                        index={2}
                        choice={game.choices[2]}
                        updateChoice={updateChoice}
                    />
                    <ChoiceEdit
                        choiceCount={choiceCount}
                        index={3}
                        choice={game.choices[3]}
                        updateChoice={updateChoice}
                    />
                    <ChoiceEdit
                        choiceCount={choiceCount}
                        index={4}
                        choice={game.choices[4]}
                        updateChoice={updateChoice}
                    />
                    <ChoiceEdit
                        choiceCount={choiceCount}
                        index={5}
                        choice={game.choices[5]}
                        updateChoice={updateChoice}
                    />
                    <ChoiceEdit
                        choiceCount={choiceCount}
                        index={6}
                        choice={game.choices[6]}
                        updateChoice={updateChoice}
                    />
                    <ChoiceEdit
                        choiceCount={choiceCount}
                        index={7}
                        choice={game.choices[7]}
                        updateChoice={updateChoice}
                    />
                    <ChoiceEdit
                        choiceCount={choiceCount}
                        index={8}
                        choice={game.choices[8]}
                        updateChoice={updateChoice}
                    />
                    <ChoiceEdit
                        choiceCount={choiceCount}
                        index={9}
                        choice={game.choices[9]}
                        updateChoice={updateChoice}
                    />
                </VS.ChoiceLayoutSettingGrid>
            </VS.ChoiceLayoutSettingContainer>
        </div>
    )
}

interface IChoiceCountTypeButton {
    count: number
    layoutCount: number
    choiceCountType: number
    setChoiceCountType: Dispatch<SetStateAction<number>>
}
const ChoiceCountTypeButton = ({
    count,
    layoutCount,
    choiceCountType,
    setChoiceCountType,
}: IChoiceCountTypeButton) => {
    const BUTTON_COUNT = count

    const isSelected =
        Math.floor(choiceCountType / CHOICE_COUNT_CONST) === BUTTON_COUNT

    const layoutType = choiceCountType % CHOICE_COUNT_CONST
    const handleClick = () => {
        if (!isSelected) {
            setChoiceCountType(BUTTON_COUNT * CHOICE_COUNT_CONST)
            return
        }

        let _layoutType = layoutType + 1

        if (_layoutType > layoutCount - 1) {
            _layoutType = 0
        }

        setChoiceCountType(BUTTON_COUNT * CHOICE_COUNT_CONST + _layoutType)
    }

    return (
        <VS.InputTypeButton
            $is_show={isSelected}
            onClick={() => {
                handleClick()
            }}
        >
            {BUTTON_COUNT}개
            {false && (
                <span className="text-right w-3 text-xs text-stone-300">
                    {layoutType + 1}
                </span>
            )}
        </VS.InputTypeButton>
    )
}

interface IChoiceEdit {
    choiceCount: number
    index: number
    choice: VersusGameChoice
    updateChoice: (index: number, choice: VersusGameChoice) => void
}
const ChoiceEdit = ({
    choiceCount,
    index,
    choice,
    updateChoice,
}: IChoiceEdit) => {
    const [title, setTitle] = useState<string>("")
    const [isFocus, setFocus] = useState<boolean>(false)
    const inputRef = useRef(null)

    const [isFileEnter, setFileEnter] = useState<boolean>(false)
    const [image, setImage] = useState<VersusFile>(new VersusFile())

    useEffect(() => {
        getImage()

        setTitle(choice.title)
    }, [choice])

    const getImage = async () => {
        if (CommonUtils.isStringNullOrEmpty(choice.imageId)) {
            return
        }
        const [bResult, statusCode, response] = await ApiUtils.request(
            `/api/files/${choice.imageId}`,
            "GET",
        )

        if (bResult) {
            const image = new VersusFile()
            image.parseResponse(response)
            setImage(image)
        } else {
            alert(response)
        }
    }

    const handleUpdateTitle = () => {
        choice.title = title

        updateChoice(index, choice)
    }

    const handleImageUpload = async (_file: File) => {
        // 이미지 축소시킬 것
        const [bResult, statusCode, response] = await ApiUtils.fileUpload(_file)

        if (!bResult) {
            alert("업로드 실패했습니다.")
            return
        }

        const versusFile = new VersusFile()
        versusFile.parseResponse(response)
        setImage(versusFile)

        choice.imageId = versusFile.id
        choice.imageUrl = versusFile.url
        updateChoice(index, choice)
    }

    const handleImageUploadButton = (
        e: ChangeEventHandler<HTMLInputElement>,
    ) => {
        const files = e.target.files

        if (files && files.length > 0) {
            handleImageUpload(files[0])
        }
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    return (
        <VS.ChoiceBox $is_show={index < choiceCount}>
            <VS.ChoiceThumbnailBox>
                {!image.isEmpty() && (
                    <Image src={image.mediaUrl()} fill alt={""} />
                )}
                <VS.ChoiceImageEditBox $is_active={!image.isEmpty()}>
                    <ImageDragAndDrop
                        handleUpload={handleImageUpload}
                        setFileEnter={setFileEnter}
                    >
                        <VS.ThumbnailImageEditUploadDragBox
                            $is_active={isFileEnter}
                        >
                            <p className="max-sm:hidden sm:block">
                                여기에 썸네일 이미지를
                                <br />
                                드래그하세요
                            </p>
                            <i class="max-sm:block sm:hidden fa-solid fa-file-import text-base"></i>
                        </VS.ThumbnailImageEditUploadDragBox>
                    </ImageDragAndDrop>

                    <div className="w-full mt-2">
                        <input
                            id={`versus-choice-image-upload-${index}`}
                            className="hidden"
                            type={"file"}
                            onChange={handleImageUploadButton}
                        />
                        <VS.ThumbnailImageEditUploadButton
                            htmlFor={`versus-choice-image-upload-${index}`}
                        >
                            이미지 업로드
                        </VS.ThumbnailImageEditUploadButton>
                    </div>
                </VS.ChoiceImageEditBox>
            </VS.ChoiceThumbnailBox>
            <VS.ChoiceInfoBox>
                <VS.ChoiceTitleBox
                    $is_focus={isFocus}
                    onClick={() => {
                        if (inputRef.current) {
                            inputRef.current.focus()
                        }
                    }}
                >
                    <input
                        ref={inputRef}
                        className="input"
                        type={"text"}
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value)
                        }}
                        placeholder={`${index + 1}. 제목을 입력하세요`}
                        onFocus={() => {
                            setFocus(true)
                        }}
                        onBlur={() => {
                            setFocus(false)
                            handleUpdateTitle()
                            StyleUtils.rollbackScreen()
                        }}
                    />
                </VS.ChoiceTitleBox>
            </VS.ChoiceInfoBox>
        </VS.ChoiceBox>
    )
}
