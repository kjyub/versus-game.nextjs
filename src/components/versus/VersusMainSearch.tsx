"use client"

import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import CommonUtils from "@/utils/CommonUtils"
import * as VersusStyles from "@/styles/VersusStyles"
import VersusSearchInput from "./inputs/VersusSearchInput"
import { useRouter, useSearchParams } from "next/navigation"

interface IVersusMainSearch {}
const VersusMainSearch = ({}: IVersusMainSearch) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [searchValue, setSearchValue] = useState<string>("")

    useEffect(() => {
        const search = searchParams.get("search")

        if (!CommonUtils.isStringNullOrEmpty(search)) {
            setSearchValue(search)
        }
    }, [searchParams])

    const handleSearch = () => {
        let query = {}

        searchParams.forEach(
            (value: string, key: string, parent: URLSearchParams) => {
                query[key] = value
            },
        )

        if (!CommonUtils.isStringNullOrEmpty(searchValue)) {
            query["search"] = searchValue
        } else {
            delete query.search
        }

        let queryUrl = ""
        if (Object.keys(query).length > 0) {
            queryUrl += "?"
            queryUrl += new URLSearchParams(query).toString()
        }

        router.push(`/${queryUrl}`)
    }

    return (
        <VersusStyles.MainSearchLayout>
            <VersusSearchInput
                value={searchValue}
                setValue={setSearchValue}
                onEnter={() => {
                    handleSearch()
                }}
            />
        </VersusStyles.MainSearchLayout>
    )
}

export default VersusMainSearch
