"use client"

import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import CommonUtils from "@/utils/CommonUtils"
import * as VS from "@/styles/VersusStyles"
import { useUi } from "@/hooks/useUi"
import VersusMainSearch from "./VersusMainSearch"

const VersusMainTitle = () => {
    const { isScrollTop } = useUi()

    return (
        <VS.MainTitleLayout $is_active={isScrollTop}>
            <VersusMainSearch />
        </VS.MainTitleLayout>
    )
}

export default VersusMainTitle
