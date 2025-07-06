'use client';

import { useFocus } from '@/hooks/useFocus';
import * as UserStyles from '@/styles/UserStyles';
import { type Dispatch, type KeyboardEvent, type ReactNode, type SetStateAction, useState } from 'react';

export interface IUserInputText extends React.InputHTMLAttributes<HTMLInputElement> {
  setValue?: Dispatch<SetStateAction<string>>;
  label?: string;
  labelMessage?: ReactNode;
  disabled?: boolean;
  autoPassword?: boolean;
  onEnter?: () => void;
}
const UserInputText = ({
  setValue,
  label = '',
  labelMessage = null,
  autoPassword = true,
  onEnter,
  ...props
}: IUserInputText) => {
  const { isFocus, ref } = useFocus<HTMLInputElement>();

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (onEnter && e.key === 'Enter') {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <UserStyles.InputContainer>
      <div className="label flex flex-col w-full px-1 mb-1">
        {label && <UserStyles.InputTitle className="text-sm">{label}</UserStyles.InputTitle>}
        {labelMessage !== null && labelMessage}
      </div>
      <UserStyles.InputBox $is_focus={isFocus} $disabled={props.disabled}>
        <input
          ref={ref}
          onChange={(e) => {
            setValue?.(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          autoComplete={autoPassword ? 'new-password' : undefined}
          {...props}
        />
      </UserStyles.InputBox>
    </UserStyles.InputContainer>
  );
};

export default UserInputText;
