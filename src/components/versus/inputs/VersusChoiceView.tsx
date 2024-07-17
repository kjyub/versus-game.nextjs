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
import { ChoiceSelectStatus } from "@/types/VersusTypes"

const CHOICE_COUNT_CONST = 100

interface IVersusChoiceView {
    game: VersusGame
    selectChoice: (choice: VersusGameChoice) => void
    selectedChoice: VersusGameChoice
}
export default function VersusChoiceView({
    game,
    selectChoice,
    selectedChoice,
}: IVersusChoiceView) {
    const [choiceCount, setChoiceCount] = useState<number>(0)
    const [layoutType, setLayoutType] = useState<number>(0)

    const [choices, setChoices] = useState<Array<VersusGameChoice>>([])

    useEffect(() => {
        setChoiceCount(Math.floor(game.choiceCountType / CHOICE_COUNT_CONST))
        setLayoutType(game.choiceCountType % CHOICE_COUNT_CONST)
        setChoices(game.choices)
    }, [game])

    return (
        <VS.ChoiceLayoutSettingGrid $choice_count={choiceCount}>
            <ChoiceView
                choiceCount={choiceCount}
                index={0}
                choice={game.choices[0]}
                selectChoice={selectChoice}
                selectedChoice={selectedChoice}
            />
            <ChoiceView
                choiceCount={choiceCount}
                index={1}
                choice={game.choices[1]}
                selectChoice={selectChoice}
                selectedChoice={selectedChoice}
            />
            <ChoiceView
                choiceCount={choiceCount}
                index={2}
                choice={game.choices[2]}
                selectChoice={selectChoice}
                selectedChoice={selectedChoice}
            />
            <ChoiceView
                choiceCount={choiceCount}
                index={3}
                choice={game.choices[3]}
                selectChoice={selectChoice}
                selectedChoice={selectedChoice}
            />
            <ChoiceView
                choiceCount={choiceCount}
                index={4}
                choice={game.choices[4]}
                selectChoice={selectChoice}
                selectedChoice={selectedChoice}
            />
            <ChoiceView
                choiceCount={choiceCount}
                index={5}
                choice={game.choices[5]}
                selectChoice={selectChoice}
                selectedChoice={selectedChoice}
            />
            <ChoiceView
                choiceCount={choiceCount}
                index={6}
                choice={game.choices[6]}
                selectChoice={selectChoice}
                selectedChoice={selectedChoice}
            />
            <ChoiceView
                choiceCount={choiceCount}
                index={7}
                choice={game.choices[7]}
                selectChoice={selectChoice}
                selectedChoice={selectedChoice}
            />
            <ChoiceView
                choiceCount={choiceCount}
                index={8}
                choice={game.choices[8]}
                selectChoice={selectChoice}
                selectedChoice={selectedChoice}
            />
            <ChoiceView
                choiceCount={choiceCount}
                index={9}
                choice={game.choices[9]}
                selectChoice={selectChoice}
                selectedChoice={selectedChoice}
            />
        </VS.ChoiceLayoutSettingGrid>
    )
}

interface IChoiceView {
    choiceCount: number
    index: number
    choice: VersusGameChoice
    selectChoice: (choice: VersusGameChoice) => void
    selectedChoice: VersusGameChoice
}
const ChoiceView = ({
    choiceCount,
    index,
    choice,
    selectChoice,
    selectedChoice,
}: IChoiceView) => {
    const [selectStatus, setSelectStatus] = useState<ChoiceSelectStatus>(
        ChoiceSelectStatus.WAIT,
    )

    const [image, setImage] = useState<VersusFile>(new VersusFile())

    useEffect(() => {
        getImage()
    }, [choice])

    useEffect(() => {
        updateSelectStatus()
    }, [selectedChoice])

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

    const updateSelectStatus = () => {
        if (CommonUtils.isStringNullOrEmpty(selectedChoice.id)) {
            setSelectStatus(ChoiceSelectStatus.WAIT)
            return
        }

        if (selectedChoice.id === choice.id) {
            setSelectStatus(ChoiceSelectStatus.SELECTED)
        } else {
            setSelectStatus(ChoiceSelectStatus.UNSELECTED)
        }
    }

    const handleSelectChoice = () => {
        selectChoice(choice)
    }

    return (
        <VS.ChoiceBox $is_show={index < choiceCount}>
            <VS.GameViewChoiceThumbnailBox $status={selectStatus}>
                {!image.isEmpty() && (
                    <Image src={image.mediaUrl()} fill alt={""} />
                )}
                <VS.ChoiceImageContentBox
                    className="content"
                    $status={selectStatus}
                    onClick={() => {
                        handleSelectChoice()
                    }}
                >
                    <span
                        className="title"
                        style={{
                            textShadow:
                                "-1px 0 #44403c, 0 1px #44403c, 1px 0 #44403c, 0 -1px #44403c",
                        }}
                    >
                        {choice.title}
                    </span>
                </VS.ChoiceImageContentBox>
            </VS.GameViewChoiceThumbnailBox>
        </VS.ChoiceBox>
    )
}
