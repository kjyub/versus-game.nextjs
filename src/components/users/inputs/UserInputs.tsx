"use client";

import * as UserStyles from "@/styles/UserStyles";
import CommonUtils from "@/utils/CommonUtils";
import { Dispatch, KeyboardEvent, ReactNode, SetStateAction, useState } from "react";

export interface IUserInputText {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  label: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute | undefined;
  labelMessage: ReactNode;
  disabled: boolean;
  autoPassword: boolean;
  onEnter: () => void;
}
const UserInputText = ({
  value,
  setValue,
  label = "",
  placeholder = "",
  type = "text",
  labelMessage = null,
  disabled = false,
  autoPassword = true,
  onEnter = null,
}: IUserInputText) => {
  const [isFocus, setFocus] = useState<boolean>(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (onEnter && e.key === "Enter") {
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
      <UserStyles.InputBox $is_focus={isFocus} $disabled={disabled}>
        <input
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
          autoComplete={autoPassword ? "new-password" : undefined}
        />
      </UserStyles.InputBox>
    </UserStyles.InputContainer>
  );
};

export default UserInputText;
