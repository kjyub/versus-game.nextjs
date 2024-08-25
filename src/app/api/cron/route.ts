import GameUtils from "@/utils/GameUtils"
import { NextResponse } from "next/server"

export const revalidate = 0

export async function GET() {
    try {
        GameUtils.updateRelatedGames()
    } catch (error) {
        //
    }

    return NextResponse.json({ ok: true })
}