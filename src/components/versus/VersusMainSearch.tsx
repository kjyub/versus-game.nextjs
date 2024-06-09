"use client"

import React, { Dispatch, SetStateAction, useState } from "react"
import CommonUtils from "@/utils/CommonUtils"
import * as VersusStyles from "@/styles/VersusStyles"
import VersusSearchInput from "./inputs/VersusSearchInput"

interface IVersusMainSearch {}
const VersusMainSearch = ({}: IVersusMainSearch) => {
    const [searchValue, setSearchValue] = useState<string>("")

    return (
        <VersusStyles.MainSearchLayout>
            <VersusSearchInput value={searchValue} setValue={setSearchValue} />
        </VersusStyles.MainSearchLayout>
    )
}

export default VersusMainSearch
