"use client"

import React, {
    Dispatch,
    KeyboardEvent,
    ReactNode,
    SetStateAction,
    useState,
} from "react"
import CommonUtils from "@/utils/CommonUtils"
import * as UserStyles from "@/styles/UserStyles"

export interface IUserInputText {
    value: string
    setValue: Dispatch<SetStateAction<string>>
    label: string
    placeholder: string
    type?: HTMLInputTypeAttribute | undefined
    labelMessage: ReactNode
    disabled: boolean
    onEnter: () => void
}
const UserInputText = ({
    value,
    setValue,
    label = "",
    placeholder = "",
    type = "text",
    labelMessage = null,
    disabled = false,
    onEnter = null,
}: IUserInputText) => {
    const [isFocus, setFocus] = useState<boolean>(false)

    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        if (onEnter && e.key === "Enter") {
            e.preventDefault()
            onEnter()
        }
    }
    return (
        <UserStyles.InputContainer>
            <div className="flex justify-between items-center w-full px-1 mb-1">
                {!CommonUtils.isStringNullOrEmpty(label) && (
                    <label className="text-sm">{label}</label>
                )}
                {labelMessage !== null && labelMessage}
            </div>
            <UserStyles.InputBox $is_focus={isFocus} $disabled={disabled}>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                    placeholder={placeholder}
                    onFocus={() => {
                        setFocus(true)
                    }}
                    onBlur={() => {
                        setFocus(false)
                    }}
                    disabled={disabled}
                    onKeyDown={handleKeyDown}
                />
            </UserStyles.InputBox>
        </UserStyles.InputContainer>
    )
}

export default UserInputText
