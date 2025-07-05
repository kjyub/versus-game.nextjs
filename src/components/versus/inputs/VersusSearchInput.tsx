'use client';

import * as VersusStyles from '@/styles/VersusStyles';
import type { Dispatch, SetStateAction } from 'react';

export interface IVersusSearchInput {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onEnter: () => void;
  onClick: () => void;
}
const VersusSearchInput = ({ value, setValue, onEnter, onClick }: IVersusSearchInput) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onEnter && e.key === 'Enter') {
      e.preventDefault();
      onEnter();
    }
  };

  const handleClear = () => {
    setValue('');
  };

  return (
    <VersusStyles.SearchInputBox>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        placeholder="주제를 찾거나 추가해보세요"
      />
      <i
        className={`clear fa-solid fa-circle-xmark ${value ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => {
          handleClear();
        }}
      />
      <i
        className="search fa-solid fa-magnifying-glass"
        onClick={() => {
          onEnter();
        }}
      ></i>
    </VersusStyles.SearchInputBox>
  );
};

export default VersusSearchInput;
