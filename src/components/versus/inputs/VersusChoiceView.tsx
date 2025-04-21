'use client'

import * as VS from '@/styles/VersusStyles'
import { TextFormats } from '@/types/CommonTypes'
import { CHOICE_COUNT_CONST, ChoiceSelectStatus } from '@/types/VersusTypes'
import VersusFile from '@/types/file/VersusFile'
import VersusGame from '@/types/versus/VersusGame'
import VersusGameChoice from '@/types/versus/VersusGameChoice'
import ApiUtils from '@/utils/ApiUtils'
import CommonUtils from '@/utils/CommonUtils'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import VersusChoiceProgressBar from './VersusChoiceProgressBar'

interface IVersusChoiceView {
  game: VersusGame
  choices: Array<VersusGameChoice>
  selectChoice: (choice: VersusGameChoice) => void
  selectedChoice: VersusGameChoice
  isShowResult: boolean
}
export default function VersusChoiceView({
  game,
  choices,
  selectChoice,
  selectedChoice,
  isShowResult,
}: IVersusChoiceView) {
  const [choiceCount, setChoiceCount] = useState<number>(0)
  const [layoutType, setLayoutType] = useState<number>(0)

  useEffect(() => {
    setChoiceCount(Math.floor(game.choiceCountType / CHOICE_COUNT_CONST))
    setLayoutType(game.choiceCountType % CHOICE_COUNT_CONST)
  }, [game])

  return (
    <VS.ChoiceLayoutSettingGrid $choice_count={choiceCount}>
      {choices[0] && (
        <ChoiceView
          choiceCount={choiceCount}
          index={0}
          choice={choices[0]}
          selectChoice={selectChoice}
          selectedChoice={selectedChoice}
          isShowResult={isShowResult}
        />
      )}
      {choices[1] && (
        <ChoiceView
          choiceCount={choiceCount}
          index={1}
          choice={choices[1]}
          selectChoice={selectChoice}
          selectedChoice={selectedChoice}
          isShowResult={isShowResult}
        />
      )}
      {choices[2] && (
        <ChoiceView
          choiceCount={choiceCount}
          index={2}
          choice={choices[2]}
          selectChoice={selectChoice}
          selectedChoice={selectedChoice}
          isShowResult={isShowResult}
        />
      )}
      {choices[3] && (
        <ChoiceView
          choiceCount={choiceCount}
          index={3}
          choice={choices[3]}
          selectChoice={selectChoice}
          selectedChoice={selectedChoice}
          isShowResult={isShowResult}
        />
      )}
      {choices[4] && (
        <ChoiceView
          choiceCount={choiceCount}
          index={4}
          choice={choices[4]}
          selectChoice={selectChoice}
          selectedChoice={selectedChoice}
          isShowResult={isShowResult}
        />
      )}
      {choices[5] && (
        <ChoiceView
          choiceCount={choiceCount}
          index={5}
          choice={choices[5]}
          selectChoice={selectChoice}
          selectedChoice={selectedChoice}
          isShowResult={isShowResult}
        />
      )}
      {choices[6] && (
        <ChoiceView
          choiceCount={choiceCount}
          index={6}
          choice={choices[6]}
          selectChoice={selectChoice}
          selectedChoice={selectedChoice}
          isShowResult={isShowResult}
        />
      )}
      {choices[7] && (
        <ChoiceView
          choiceCount={choiceCount}
          index={7}
          choice={choices[7]}
          selectChoice={selectChoice}
          selectedChoice={selectedChoice}
          isShowResult={isShowResult}
        />
      )}
      {choices[8] && (
        <ChoiceView
          choiceCount={choiceCount}
          index={8}
          choice={choices[8]}
          selectChoice={selectChoice}
          selectedChoice={selectedChoice}
          isShowResult={isShowResult}
        />
      )}
      {choices[9] && (
        <ChoiceView
          choiceCount={choiceCount}
          index={9}
          choice={choices[9]}
          selectChoice={selectChoice}
          selectedChoice={selectedChoice}
          isShowResult={isShowResult}
        />
      )}
    </VS.ChoiceLayoutSettingGrid>
  )
}

interface IChoiceView {
  choiceCount: number
  index: number
  choice: VersusGameChoice
  selectChoice: (choice: VersusGameChoice) => void
  selectedChoice: VersusGameChoice
  isShowResult: boolean
}
const ChoiceView = ({ choiceCount, index, choice, selectChoice, selectedChoice, isShowResult }: IChoiceView) => {
  const [selectStatus, setSelectStatus] = useState<ChoiceSelectStatus>(ChoiceSelectStatus.WAIT)

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
    const [bResult, statusCode, response] = await ApiUtils.request(`/api/files/${choice.imageId}`, 'GET')

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
        {!image.isEmpty() && <Image src={image.mediaUrl()} fill alt={''} />}
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
              textShadow: '-1px 0 #44403c, 0 1px #44403c, 1px 0 #44403c, 0 -1px #44403c',
            }}
          >
            {choice.title}
          </span>
        </VS.ChoiceImageContentBox>
        <VS.GameViewChoiceResultBox $is_show={isShowResult}>
          {/* 데스크탑 */}
          <div>{CommonUtils.textFormat(choice.voteCount, TextFormats.NUMBER)}명</div>
          <div className="flex items-center max-sm:space-x-1 sm:space-x-2 max-sm:px-0!">
            <div className="max-sm:w-10 sm:w-24">
              <VersusChoiceProgressBar percent={choice.voteRate} />
            </div>
            <span className="text-right font-normal">{CommonUtils.round(choice.voteRate, 3)}%</span>
          </div>
        </VS.GameViewChoiceResultBox>
      </VS.GameViewChoiceThumbnailBox>
    </VS.ChoiceBox>
  )
}
