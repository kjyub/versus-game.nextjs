import React from "react"
import { AbsApiObject } from "../ApiTypes"
import VersusGameChoice from "./VersusGameChoice"
import { GameState, PrivacyTypes, ThumbnailImageTypes } from "../VersusTypes"
import User from "../user/User"

const CHOICE_COUNT = 10

export default class VersusGame extends AbsApiObject {
    private _id: string
    private _nanoId: string
    private _title: string
    private _content: string
    private _userId: string
    private _thumbnailImageId: string
    private _thumbnailImageUrl: string
    private _thumbnailImageType: ThumbnailImageTypes
    private _privacyType: PrivacyTypes
    private _views: number
    private _favs: number
    private _state: GameState

    private _choices: Array<VersusGameChoice>

    // 임의 정의
    private _user: User
    private _isView: booelan // 사용자가 게임을 조회 했었는지 여부

    private _relatedGames: Array<VersusGame>

    constructor() {
        super()
        this._id = ""
        this._nanoId = ""
        this._title = ""
        this._content = ""
        this._userId = ""
        this._thumbnailImageId = ""
        this._thumbnailImageUrl = ""
        this._thumbnailImageType = ThumbnailImageTypes.IMAGE
        this._privacyType = PrivacyTypes.PUBLIC
        this._views = ""
        this._favs = ""
        this._state = GameState.NORMAL

        this._choiceCountType = 200
        this._choices = []
        for (let i = 0; i < CHOICE_COUNT; i++) {
            this._choices.push(new VersusGameChoice())
        }

        this._user = new User()
        this._isView = false
        this._isChoice = false

        this._relatedGames = []
    }

    parseResponse(json: object) {
        if (json._id) this._id = String(json._id)
        if (json.nanoId) this._nanoId = String(json.nanoId)
        if (json.title) this._title = json.title
        if (json.content) this._content = json.content
        if (json.userId) this._userId = json.userId
        if (json.thumbnailImageId)
            this._thumbnailImageId = json.thumbnailImageId
        if (json.thumbnailImageUrl)
            this._thumbnailImageUrl = json.thumbnailImageUrl
        if (json.thumbnailImageType)
            this._thumbnailImageType = json.thumbnailImageType
        if (json.privacyType) this._privacyType = json.privacyType
        if (json.views) this._views = json.views
        if (json.favs) this._favs = json.favs
        if (json.state) this._state = json.state

        if (json.choiceCountType) this._choiceCountType = json.choiceCountType
        if (json.choices && Array.isArray(json.choices)) {
            let newChoices: Array<VersusGameChoice> = []
            json.choices.map((choiceData: any) => {
                const _choice = new VersusGameChoice()
                _choice.parseResponse(choiceData)
                newChoices.push(_choice)
            })
            this._choices = newChoices
        }

        if (json.user && typeof json.user === "object") {
            this._user = new User()
            this._user.parseResponse(json.user)
        }
        if (json.isView) {
            this._isView = json.isView
        }
        if (json.isChoice) {
            this._isChoice = json.isChoice
        }

        if (json.relatedGames && Array.isArray(json.relatedGames)) {
            this._relatedGames = []
            json.relatedGames.map((_data) => {
                const relatedGame = new VersusGame()
                relatedGame.parseResponse(_data)
                this._relatedGames.push(relatedGame)
            })
        } 
    }

    get id(): string {
        return this._id
    }
    get nanoId(): string {
        return this._nanoId
    }
    get title(): string {
        return this._title
    }
    get content(): string {
        return this._content
    }
    get userId(): string {
        return this._userId
    }
    get thumbnailImageId(): string {
        return this._thumbnailImageId
    }
    get thumbnailImageUrl(): string {
        return this._thumbnailImageUrl
    }
    get thumbnailImageType(): ThumbnailImageTypes {
        return this._thumbnailImageType
    }
    get privacyType(): number {
        return this._privacyType
    }
    get views(): string {
        return this._views
    }
    get favs(): string {
        return this._favs
    }
    get state(): GameState {
        return this._state
    }
    get choiceCountType(): number {
        return this._choiceCountType
    }
    get user(): User {
        return this._user
    }
    get isView(): boolean {
        return this._isView
    }
    get isChoice(): boolean {
        return this._isChoice
    }
    get relatedGames(): Array<VersusGame> {
        return this._relatedGames
    }

    set title(v: string) {
        this._title = v
    }
    set content(v: string) {
        this._content = v
    }
    set thumbnailImageId(v: string) {
        this._thumbnailImageId = v
    }
    set thumbnailImageUrl(v: string) {
        this._thumbnailImageUrl = v
    }
    set thumbnailImageType(v: ThumbnailImageTypes) {
        this._thumbnailImageType = v
    }
    set privacyType(v: PrivacyTypes) {
        this._privacyType = v
    }
    set state(v: GameState) {
        this._state = v
    }
    set isView(v: boolean) {
        this._isView = v
    }
    set isChoice(v: boolean) {
        this._isChoice = v
    }

    set choiceCountType(v: number) {
        this._choiceCountType = v
    }
    get choices(): Array<VersusGameChoice> {
        return this._choices
    }

    updateChoice(index: number, _choice: VersusGameChoice) {
        try {
            this._choices[index] = _choice
        } catch {
            //
        }
    }
}
