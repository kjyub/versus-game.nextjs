"use client"

import React, { Dispatch, SetStateAction } from "react"
import CommonUtils from "@/utils/CommonUtils"
import * as VersusStyles from "@/styles/VersusStyles"

export interface IVersusSearchInput {
    value: string
    setValue: Dispatch<SetStateAction<string>>
}
const VersusSearchInput = ({ value, setValue }: IVersusSearchInput) => {
    return (
        // <></>
        <VersusStyles.SearchInputBox>
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                }}
            />
        </VersusStyles.SearchInputBox>
    )
}

export default VersusSearchInput
