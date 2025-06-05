'use client';

import * as VersusStyles from '@/styles/VersusStyles';
import { type Dispatch, type KeyboardEvent, type ReactNode, type SetStateAction, useState } from 'react';

export interface IVersusInputText extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  label?: string;
  placeholder?: string;
  labelMessage?: ReactNode;
  disabled?: boolean;
  onEnter?: () => void;
}
export const VersusInputText = ({
  value,
  setValue,
  label = '',
  placeholder = '',
  type = 'text',
  labelMessage = null,
  disabled = false,
  onEnter,
  ...props
}: IVersusInputText) => {
  const [isFocus, setFocus] = useState<boolean>(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (onEnter && e.key === 'Enter') {
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
          {...props}
        />
      </VersusStyles.InputBox>
    </VersusStyles.InputContainer>
  );
};

export interface IVersusTextAreaText extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  label?: string;
  placeholder?: string;
  labelMessage?: ReactNode;
  disabled?: boolean;
  onEnter?: () => void;
}
export const VersusInputTextArea = ({
  value,
  setValue,
  label = '',
  placeholder = '',
  labelMessage = null,
  disabled = false,
  ...props
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
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          disabled={disabled}
          {...props}
        />
      </VersusStyles.InputBox>
    </VersusStyles.InputContainer>
  );
};
