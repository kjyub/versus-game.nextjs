"use client";

import * as VersusStyles from "@/styles/VersusStyles";
import { Dispatch, KeyboardEvent, ReactNode, SetStateAction, useState } from "react";

export interface IVersusInputText {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  label: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute | undefined;
  labelMessage: ReactNode;
  disabled: boolean;
  onEnter: () => void;
}
export const VersusInputText = ({
  value,
  setValue,
  label = "",
  placeholder = "",
  type = "text",
  labelMessage = null,
  disabled = false,
  onEnter = null,
}: IVersusInputText) => {
  const [isFocus, setFocus] = useState<boolean>(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (onEnter && e.key === "Enter") {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <VersusStyles.InputContainer>
      <div className="label flex justify-between items-center w-full mb-1">
        {label && <VersusStyles.InputTitle>{label}</VersusStyles.InputTitle>}
        {labelMessage !== null && labelMessage}
      </div>
      <VersusStyles.InputBox $is_focus={isFocus} $disabled={disabled}>
        <input
          className="input"
          type={type}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          disabled={disabled}
          onKeyDown={handleKeyDown}
        />
      </VersusStyles.InputBox>
    </VersusStyles.InputContainer>
  );
};

export interface IVersusTextAreaText {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  label: string;
  placeholder: string;
  rows: number;
  labelMessage: ReactNode;
  disabled: boolean;
  onEnter: () => void;
}
export const VersusInputTextArea = ({
  value,
  setValue,
  label = "",
  placeholder = "",
  rows = "4",
  labelMessage = null,
  disabled = false,
}: IVersusTextAreaText) => {
  const [isFocus, setFocus] = useState<boolean>(false);

  return (
    <VersusStyles.InputContainer>
      <div className="label flex justify-between items-center w-full mb-1">
        {label && <VersusStyles.InputTitle>{label}</VersusStyles.InputTitle>}
        {labelMessage !== null && labelMessage}
      </div>
      <VersusStyles.InputBox $is_focus={isFocus} $disabled={disabled}>
        <textarea
          className="input resize-none w-full"
          rows={rows}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          disabled={disabled}
        />
      </VersusStyles.InputBox>
    </VersusStyles.InputContainer>
  );
};
