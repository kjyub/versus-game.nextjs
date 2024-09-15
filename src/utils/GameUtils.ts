import MVersusGame from "@/models/versus/MVersusGame"
import CommonUtils from "./CommonUtils"
import MVersusGameView from "@/models/versus/MVersusGameView"
import { Dictionary } from "@/types/common/Dictionary"
import { GameConsts } from "@/types/VersusTypes"
import mongoose from "mongoose"
import MVersusGameAnswer from "@/models/versus/MVersusGameAnswer"

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
                { $limit: GameConsts.RELATED_GAME_COUNT },
            ])
            // console.log(`2. 연관 게임 조회`, relatedGames)
            
            const relatedGameIds = relatedGames.map((rg) => rg._id)

            game.relatedUpdateViewCount = viewers.length
            game.relatedGameIds = relatedGameIds
            await game.save()
        }

        console.log("END")
    }

    // 조회하거나 선택했는지 확인
    static async isViewAndChoiceGames(items: Array<MVersusGame>, userId: string) {
        let newItems: Array<MVersusGame> = []

        const gameIds = items.map(item => item._id)
        const views = await MVersusGameView.find({ gameId: { $in : gameIds }, userId: userId })
        const viewIdSet = new Set(views.map(view => view.gameId))

        const choiceds = await MVersusGameAnswer.find({ gameId: { $in : gameIds }, userId: userId })
        const choiceIdSet = new Set(choiceds.map(choiced => choiced.gameId))
        
        if (views.length > 0) {
            items.map((item) => {                
                newItems.push({
                    ...item.toObject(),
                    isView: viewIdSet.has(String(item._id)),
                    isChoice: choiceIdSet.has(String(item._id)),
                })
            })
        }

        // console.log("new Items", newItems)

        return newItems
    }

    // 연관 랜덤 게임 가져오기
    static async getRelatedRandomGames(excludeGameIds: Array<string> = [], gameCount: number = GameConsts.RELATED_GAME_COUNT) {
        const excludeGameObjectIds: Array<mongoose.Types.ObjectId> = excludeGameIds.map(gameId => (
            new mongoose.Types.ObjectId(gameId)
        ))

        const relatedGames = await MVersusGame.aggregate([
            { $match: { _id: { $nin: excludeGameObjectIds } } },  // 제외할 ID들 필터링
            { $sample: { size: gameCount - excludeGameIds.length + 1 } }  // 무작위로 10개 추출
        ])

        return relatedGames
    }
}
