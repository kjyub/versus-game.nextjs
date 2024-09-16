"use client"

import VersusGame from "@/types/versus/VersusGame"
import VersusGameChoice from "@/types/versus/VersusGameChoice"
import { GameState, PrivacyTypes } from "@/types/VersusTypes"
import ApiUtils from "@/utils/ApiUtils"
import CommonUtils from "@/utils/CommonUtils"
import Image from "next/image"
import { useEffect, useState } from "react"
import * as SS from "@/styles/StaffStyles"
import ModalContainer from "../ModalContainer"
import VersusEditor from "../versus/VersusEditor"

const PAGE_SIZE = 100

export default function StaffControl() {
    const handleCron = async () => {
        const [bResult, statusCode, response] = await ApiUtils.request(
            `/api/cron/`,
            "GET",
            null,
            null,
            false,
            { Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}` }
        )
        
        if (bResult) {
            alert("실행되었습니다.")
        } else {
            alert("요청 실패했습니다.")
        }
    }

    return (
        <div className="flex flex-col w-full h-48 p-4 divide-y divide-stone-400">
            <SS.GameStateButton 
                className="p-4"
                onClick={()=>{
                    handleCron()
                }}
            >
                크론 실행
            </SS.GameStateButton>
        </div>
    )
}