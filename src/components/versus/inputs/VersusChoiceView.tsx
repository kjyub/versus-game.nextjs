"use client";

import * as VS from "@/styles/VersusStyles";
import { TextFormats } from "@/types/CommonTypes";
import { CHOICE_COUNT_CONST, ChoiceSelectStatus } from "@/types/VersusTypes";
import VersusFile from "@/types/file/VersusFile";
import VersusGame from "@/types/versus/VersusGame";
import VersusGameChoice from "@/types/versus/VersusGameChoice";
import ApiUtils from "@/utils/ApiUtils";
import CommonUtils from "@/utils/CommonUtils";
import Image from "next/image";
import { useEffect, useState } from "react";
import VersusChoiceProgressBar from "./VersusChoiceProgressBar";

interface IVersusChoiceView {
  game: VersusGame;
  choices: Array<VersusGameChoice>;
  selectChoice: (choice: VersusGameChoice) => void;
  selectedChoice: VersusGameChoice;
  isShowResult: boolean;
}
export default function VersusChoiceView({
  game,
  choices,
  selectChoice,
  selectedChoice,
  isShowResult,
}: IVersusChoiceView) {
  return (
    <VS.ChoiceLayoutSettingGrid>
      {choices.map((choice, index) => (
        <ChoiceView
          key={index}
          index={index}
          choice={choice}
          selectChoice={selectChoice}
          selectedChoice={selectedChoice}
          isShowResult={isShowResult}
        />
      ))}
    </VS.ChoiceLayoutSettingGrid>
  );
}

interface IChoiceView {
  index: number;
  choice: VersusGameChoice;
  selectChoice: (choice: VersusGameChoice) => void;
  selectedChoice: VersusGameChoice;
  isShowResult: boolean;
}
const ChoiceView = ({ index, choice, selectChoice, selectedChoice, isShowResult }: IChoiceView) => {
  const [selectStatus, setSelectStatus] = useState<ChoiceSelectStatus>(ChoiceSelectStatus.WAIT);

  useEffect(() => {
    updateSelectStatus();
  }, [selectedChoice]);

  const updateSelectStatus = () => {
    if (CommonUtils.isStringNullOrEmpty(selectedChoice.id)) {
      setSelectStatus(ChoiceSelectStatus.WAIT);
      return;
    }

    if (selectedChoice.id === choice.id) {
      setSelectStatus(ChoiceSelectStatus.SELECTED);
    } else {
      setSelectStatus(ChoiceSelectStatus.UNSELECTED);
    }
  };

  const handleSelectChoice = () => {
    selectChoice(choice);
  };

  return (
    <VS.ChoiceBox>
      <VS.GameViewChoiceThumbnailBox $status={selectStatus}>
        <VS.ChoiceImageContentBox
          className="content"
          $status={selectStatus}
          onClick={() => {
            handleSelectChoice();
          }}
        >
          <span
            className="title"
            style={{
              textShadow: "-1px 0 #44403c, 0 1px #44403c, 1px 0 #44403c, 0 -1px #44403c",
            }}
          >
            {choice.title}
          </span>
        </VS.ChoiceImageContentBox>

        {/* 결과 */}
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
  );
};
