'use client';

import * as VS from '@/styles/VersusStyles';
import { MAX_CHOICE } from '@/types/VersusTypes';
import type VersusGame from '@/types/versus/VersusGame';
import VersusGameChoice from '@/types/versus/VersusGameChoice';
import { useEffect, useRef, useState } from 'react';

interface IVersusChoiceEdit {
  game: VersusGame;
}
export default function VersusChoiceEdit({ game }: IVersusChoiceEdit) {
  const [choices, setChoices] = useState<Array<VersusGameChoice>>([]);

  useEffect(() => {
    updateOldChoices();
  }, [game]);

  const updateOldChoices = () => {
    if (!game.id || game.choices.length === 0) {
      setChoices(new Array<VersusGameChoice>(MAX_CHOICE).fill(new VersusGameChoice()));
      return;
    }

    const diff = MAX_CHOICE - game.choices.length;
    const newChoices = game.choices;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        newChoices.push(new VersusGameChoice());
      }
    }

    game.choices = newChoices;
    setChoices(newChoices);
  };

  const updateChoice = (index: number, choice: VersusGameChoice) => {
    game.updateChoice(index, choice);
  };

  return (
    <div className="flex flex-col w-full space-y-2 mt-2">
      <VS.ChoiceLayoutSettingContainer>
        {choices.map((choice, index) => (
          <ChoiceEdit key={index} index={index} choice={choice} updateChoice={updateChoice} />
        ))}
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
  const [title, setTitle] = useState<string>(choice.title || '');
  const [isFocus, setFocus] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setTitle(choice.title || '');
  }, [choice]);

  useEffect(() => {
    setIsActive(!!title);
  }, [title]);

  if (!choice) {
    return;
  }

  const handleUpdateTitle = () => {
    choice.title = title;

    updateChoice(index, choice);
  };

  return (
    <VS.ChoiceTitleBox
      $is_focus={isFocus}
      $is_active={isActive}
      onClick={() => {
        if (inputRef.current) {
          (inputRef.current as HTMLInputElement).focus();
        }
      }}
    >
      <input
        ref={inputRef}
        className="input"
        type={'text'}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={`${index + 1}. 제목을 입력하세요 ${index >= 2 ? ' (선택)' : ''}`}
        onFocus={() => setFocus(true)}
        onBlur={() => {
          setFocus(false);
          handleUpdateTitle();
        }}
      />
    </VS.ChoiceTitleBox>
  );
};
