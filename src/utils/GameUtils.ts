import MVersusGame from '@/models/versus/MVersusGame'
import MVersusGameAnswer from '@/models/versus/MVersusGameAnswer'
import MVersusGameView from '@/models/versus/MVersusGameView'
import { GameConsts } from '@/types/VersusTypes'
import { Dictionary } from '@/types/common/Dictionary'
import mongoose from 'mongoose'
import CommonUtils from './CommonUtils'

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
        { $group: { _id: '$gameId', viewsCount: { $sum: 1 } } },
        { $sort: { viewsCount: -1 } },
        { $limit: GameConsts.RELATED_GAME_COUNT },
      ])
      // console.log(`2. 연관 게임 조회`, relatedGames)

      // 3. 게임 참여자
      const answers = await MVersusGameAnswer.find({ gameId: game._id })

      const relatedGameIds = relatedGames.map((rg) => rg._id)

      game.relatedUpdateViewCount = viewers.length
      game.relatedGameIds = relatedGameIds
      game.views = viewers.length
      game.answerCount = answers.length
      await game.save()
    }

    console.log('END')
  }

  // 조회하거나 선택했는지 확인
  static async setIsViewAndChoiceGames(items: Array<MVersusGame>, userId: string) {
    let newItems: Array<MVersusGame> = []

    const gameIds = items.map((item) => item._id)
    const views = await MVersusGameView.find({ gameId: { $in: gameIds }, userId: userId })
    const viewIdSet = new Set(views.map((view) => view.gameId))

    const choiceds = await MVersusGameAnswer.find({ gameId: { $in: gameIds }, userId: userId })
    const choiceIdSet = new Set(choiceds.map((choiced) => choiced.gameId))

    if (views.length > 0) {
      items.map((item) => {
        let newItem = item instanceof mongoose.Model ? item.toObject() : item

        newItem.isView = viewIdSet.has(String(item._id))
        newItem.isChoice = choiceIdSet.has(String(item._id))
        newItems.push(newItem)
      })
    } else {
      return items
    }

    // console.log("new Items", newItems)

    return newItems
  }

  // 연관 게임 가져오기
  static async getRelatedGames(
    relatedGameIds: Array<string> = [],
    userId: string = '',
    gameCount: number = GameConsts.RELATED_GAME_COUNT,
  ) {
    const relatedGameObjectIds: Array<mongoose.Types.ObjectId> = relatedGameIds.map(
      (gameId) => new mongoose.Types.ObjectId(gameId),
    )

    let answeredGameObjectIds: Array<string> = []
    if (!CommonUtils.isStringNullOrEmpty(userId)) {
      const answeredGames = await MVersusGameAnswer.find({ userId: userId })
      answeredGameObjectIds = answeredGames.map((answeredGame) => new mongoose.Types.ObjectId(answeredGame.gameId))
    }

    // 최종적으로 선택된 연관 랜덤 게임
    const relatedGames = await MVersusGame.aggregate([
      { $match: { $and: [{ _id: { $in: relatedGameObjectIds } }, { _id: { $nin: answeredGameObjectIds } }] } }, // 제외할 ID들 필터링, 참여했던 게임 제외 필터링
      { $sample: { size: gameCount } }, // 무작위로 10개 추출
    ])

    return relatedGames.slice(0, gameCount)
  }

  // 연관 랜덤 게임 가져오기
  static async getRelatedRandomGames(
    excludeGameIds: Array<string> = [],
    userId: string = '',
    gameCount: number = GameConsts.RELATED_GAME_COUNT,
  ) {
    const excludeGameObjectIds: Array<mongoose.Types.ObjectId> = excludeGameIds.map(
      (gameId) => new mongoose.Types.ObjectId(gameId),
    )

    let answeredGameObjectIds: Array<string> = []
    if (!CommonUtils.isStringNullOrEmpty(userId)) {
      const answeredGames = await MVersusGameAnswer.find({ userId: userId })
      answeredGameObjectIds = answeredGames.map((answeredGame) => new mongoose.Types.ObjectId(answeredGame.gameId))
    }

    // 최종적으로 선택된 연관 랜덤 게임
    let resultRelatedGames = []

    // 참여한 게임이 있으면 참여하지 않은 게임들 우선으로 보여주도록 한다.
    if (answeredGameObjectIds.length > 0) {
      // 아직 참여하지 않은 게임들
      const relatedNewGames = await MVersusGame.aggregate([
        { $match: { $and: [{ _id: { $nin: excludeGameObjectIds } }, { _id: { $nin: answeredGameObjectIds } }] } }, // 제외할 ID들 필터링, 참여했던 게임 제외 필터링
        { $sample: { size: gameCount } }, // 무작위로 10개 추출
      ])

      // 참여한 게임들
      const relatedOldGames = await MVersusGame.aggregate([
        { $match: { $and: [{ _id: { $in: answeredGameObjectIds } }, { _id: { $nin: excludeGameObjectIds } }] } }, // 제외할 ID들 필터링, 참여했던 게임 포함 필터링
        { $sample: { size: gameCount } }, // 무작위로 10개 추출
      ])

      resultRelatedGames = [...relatedNewGames, ...relatedOldGames]
    } else {
      const relatedGames = await MVersusGame.aggregate([
        { $match: { _id: { $nin: excludeGameObjectIds } } }, // 제외할 ID들 필터링
        { $sample: { size: gameCount } }, // 무작위로 10개 추출
      ])

      resultRelatedGames = relatedGames
    }

    return resultRelatedGames.slice(0, gameCount)
  }
}
