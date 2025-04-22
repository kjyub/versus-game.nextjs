"use client";

import ImageDragAndDrop from "@/components/commons/inputs/ImageDragAndDrop";
import * as VS from "@/styles/VersusStyles";
import { CHOICE_COUNT_CONST, MAX_CHOICE } from "@/types/VersusTypes";
import VersusFile from "@/types/file/VersusFile";
import VersusGame from "@/types/versus/VersusGame";
import VersusGameChoice from "@/types/versus/VersusGameChoice";
import ApiUtils from "@/utils/ApiUtils";
import CommonUtils from "@/utils/CommonUtils";
import StyleUtils from "@/utils/StyleUtils";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface IVersusChoiceEdit {
  game: VersusGame;
  choiceCount: number;
  setChoiceCount: Dispatch<SetStateAction<number>>;
}
export default function VersusChoiceEdit({ game, choiceCount, setChoiceCount }: IVersusChoiceEdit) {
  const [choices, setChoices] = useState<Array<VersusGameChoice>>([]);

  useEffect(() => {
    updateOldChoices();
  }, [game]);

  const updateOldChoices = () => {
    if (CommonUtils.isStringNullOrEmpty(game.id) || game.choices.length === 0) {
      setChoices(new Array<VersusGameChoice>(choiceCount).fill(new VersusGameChoice()));
      return;
    }

    setChoices(game.choices);
  };

  const appendChoice = () => {
    if (choiceCount >= MAX_CHOICE) {
      alert("선택지는 최대 10개까지만 추가할 수 있습니다.");
      return;
    }

    const newChoice = new VersusGameChoice();
    setChoices([...choices, newChoice]);
    game.updateChoice(choices.length, newChoice);
    setChoiceCount(choices.length + 1);
  };

  const updateChoice = (index: number, choice: VersusGameChoice) => {
    game.updateChoice(index, choice);
  };

  return (
    <div className="flex flex-col max-sm:w-full w-96 space-y-2 mt-2">
      <VS.ChoiceLayoutSettingContainer>
        {choices.map((choice, index) => (
          <ChoiceEdit key={index} index={index} choice={choice} updateChoice={updateChoice} />
        ))}
        <VS.ChoiceAddBox onClick={appendChoice}>선택지 추가하기</VS.ChoiceAddBox>
      </VS.ChoiceLayoutSettingContainer>
    </div>
  );
}

interface IChoiceEdit {
  index: number;
  choice: VersusGameChoice;
  updateChoice: (index: number, choice: VersusGameChoice) => void;
}
const ChoiceEdit = ({ index, choice, updateChoice }: IChoiceEdit) => {
  const [title, setTitle] = useState<string>(choice.title || "");
  const [isFocus, setFocus] = useState<boolean>(false);
  const inputRef = useRef(null);

  if (!choice) {
    return;
  }

  const handleUpdateTitle = () => {
    choice.title = title;

    updateChoice(index, choice);
  };

  return (
    <VS.ChoiceBox>
      <VS.ChoiceTitleBox
        $is_focus={isFocus}
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <input
          ref={inputRef}
          className="input"
          type={"text"}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          placeholder={`${index + 1}. 제목을 입력하세요`}
          onFocus={() => {
            setFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
            handleUpdateTitle();
            StyleUtils.rollbackScreen();
          }}
        />
      </VS.ChoiceTitleBox>
    </VS.ChoiceBox>
  );
};
