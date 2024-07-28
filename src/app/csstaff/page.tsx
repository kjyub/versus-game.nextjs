"use client"

import StaffGameList from "@/components/staff/StaffGameList"

export default function StaffPage() {
    return (
        <div className="flex flex-col w-full">
            {/* 스태프 관리 박스 */}
            {/* 게임 리스트 박스 */}
            <StaffGameList />
        </div>
    )
}