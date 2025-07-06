'use client';

import * as VS from '@/styles/VersusStyles';
import { TextFormats } from '@/types/CommonTypes';
import { ChoiceSelectStatus } from '@/types/VersusTypes';
import type VersusGame from '@/types/versus/VersusGame';
import type VersusGameChoice from '@/types/versus/VersusGameChoice';
import CommonUtils from '@/utils/CommonUtils';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/StyleUtils';
import ChoiceRateBar from './ChoiceRateBar';
import CountUp from 'react-countup';

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
    if (!selectedChoice.id) {
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
    <VS.GameViewChoiceBox
      className={cn(['content', { 'cursor-pointer': !isShowResult}])}
      $status={selectStatus}
      onClick={() => {
        handleSelectChoice();
      }}
    >
      <div className={cn(['check-icon', { 'active': selectStatus === ChoiceSelectStatus.SELECTED }])}>
        <i className="fa-solid fa-circle-check"></i>
      </div>
      {choice.title ? (
        <span
          className="title"
          style={{
            textShadow: '-1px 0 #44403c, 0 1px #44403c, 1px 0 #44403c, 0 -1px #44403c',
          }}
        >
          {choice.title}
        </span>
      ) : (
        <span className="title text-transparent!">
          -
        </span>
      )}

      <div className={cn(['result flex flex-col flex-center', { 'active': isShowResult }])}>
        <span className="text-indigo-400 text-sm font-semibold">
          <CountUp start={0} end={isShowResult ? choice.voteRate : 0} decimals={1} suffix='%' />
        </span>
        <span className="text-white/90 text-xs">{CommonUtils.textFormat(choice.voteCount, TextFormats.KOREAN_NUMBER_SIMPLE)}명</span>
      </div>

      <div className={cn(['rate', { 'active': isShowResult }])}>
        <ChoiceRateBar percentage={isShowResult ? choice.voteRate : 0} />
      </div>
    </VS.GameViewChoiceBox>
  );
};
