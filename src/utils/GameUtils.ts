import MVersusGame from "@/models/versus/MVersusGame"
import CommonUtils from "./CommonUtils"
import MVersusGameView from "@/models/versus/MVersusGameView"
import { Dictionary } from "@/types/common/Dictionary"

// 게임 조회수 및 데이터 관련 유틸

export default class GameUtils {
    static async updateRelatedGames(): void {
        // 연관 게임 업데이트
        const games = await MVersusGame.find({ isDeleted: false })

        let viewedDic = new Dictionary<string, number>()

        for (const game of games) {
            // console.log(`0. 게임 ${game._id} ${game.nanoId} ${game.title}`)
            let gameUserDic = {}

            // 1. 게임 조회자
            const viewers = await MVersusGameView.find({ gameId: game._id })

            // console.log(`1. 게임 조회수`, viewers.length)
            if (viewers.length === 0) {
                continue
            }
            
            // 2. 현재 게임 조회자가 많이 찾은 게임들 찾기
            const viewerIds = viewers.map((view) => view.userId)
            const relatedGames = await MVersusGameView.aggregate([
                { $match: { gameId: { $ne: game._id }, userId: { $in: viewerIds } } },
                { $group: { _id: "$gameId", viewsCount: { "$sum": 1 } } },
                { $sort: { viewsCount: -1 } },
                { $limit: 10 },
            ])
            // console.log(`2. 연관 게임 조회`, relatedGames)
            
            const relatedGameIds = relatedGames.map((rg) => rg._id)

            game.relatedUpdateViewCount = viewers.length
            game.relatedGameIds = relatedGameIds
            await game.save()
        }

        console.log("END")
    }
}
