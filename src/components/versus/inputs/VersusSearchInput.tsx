"use client"

import React, { Dispatch, SetStateAction } from "react"
import CommonUtils from "@/utils/CommonUtils"
import * as VersusStyles from "@/styles/VersusStyles"

export interface IVersusSearchInput {
    value: string
    setValue: Dispatch<SetStateAction<string>>
    onEnter: () => void
}
const VersusSearchInput = ({
    value,
    setValue,
    onEnter,
}: IVersusSearchInput) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        if (onEnter && e.key === "Enter") {
            e.preventDefault()
            onEnter()
        }
    }

    return (
        // <></>
        <VersusStyles.SearchInputBox>
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                }}
                onKeyDown={handleKeyDown}
            />
        </VersusStyles.SearchInputBox>
    )
}

export default VersusSearchInput
