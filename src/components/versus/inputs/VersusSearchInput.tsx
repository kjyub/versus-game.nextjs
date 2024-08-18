"use client"

import React, { Dispatch, SetStateAction } from "react"
import CommonUtils from "@/utils/CommonUtils"
import * as VersusStyles from "@/styles/VersusStyles"
import StyleUtils from "@/utils/StyleUtils"

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

    const handleClear = () => {
        setValue("")
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
                onBlur={() => {
                    StyleUtils.rollbackScreen()
                }}
                onKeyDown={handleKeyDown}
            />
            <i 
                className={`clear fa-solid fa-circle-xmark ${!CommonUtils.isStringNullOrEmpty(value) ? "opacity-100" : "opacity-0"}`}
                onClick={()=>{handleClear()}}
            />
            <i className="search fa-solid fa-magnifying-glass" onClick={() => {onEnter()}}></i>
        </VersusStyles.SearchInputBox>
    )
}

export default VersusSearchInput
