import React from "react"
import { AbsApiObject } from "../ApiTypes"
import CommonUtils from "@/utils/CommonUtils"
import User from "../user/User"

export default class VersusGameComment extends AbsApiObject {
    private _id: string
    private _parentId: string
    private _gameId: string
    private _gameChoiceId: string
    private _userId: string
    private _user: User
    private _content: string
    private _voteUps: number
    private _voteDowns: number

    private _created: string
    private _updated: string

    constructor() {
        super()
        this._id = ""
        this._parentId = ""
        this._gameId = ""
        this._gameChoiceId = ""
        this._userId = ""
        this._user = new User()
        this._content = ""
        this._voteUps = 0
        this._voteDowns = 0

        this._created = ""
        this._updated = ""
    }

    parseResponse(json: object) {
        if (json._id) this._id = String(json._id)
        if (json.parentId) this._parentId = json.parentId
        if (json.gameId) this._gameId = json.gameId
        if (json.gameChoiceId) this._gameChoiceId = json.gameChoiceId
        if (json.userId) this._userId = json.userId
        if (json.user) {
            this._user = new User()
            this._user.parseResponse(json.user)
        }
        if (json.content) this._content = json.content
        if (json.voteUps) this._voteUps = json.voteUps
        if (json.voteDowns) this._voteDowns = json.voteDowns

        if (json.created) this._created = json.created
        if (json.updated) this._updated = json.updated
    }

    parseRequest(): object {
        let data = {
            content: this._content,
        }
        if (!CommonUtils.isStringNullOrEmpty(this._id)) {
            data["_id"] = this._id
        }

        return data
    }

    get id(): string {
        return this._id
    }
    get parentId(): string {
        return this._parentId
    }
    get gameId(): string {
        return this._gameId
    }
    get gameChoiceId(): string {
        return this._gameChoiceId
    }
    get userId(): string {
        return this._userId
    }
    get user(): User {
        return this._user
    }
    get content(): string {
        return this._content
    }
    get voteUps(): number {
        return this._voteUps
    }
    get voteDowns(): number {
        return this._voteDowns
    }

    get created(): string {
        return this._created
    }
    get updated(): string {
        return this._updated
    }

    // set title(v: string) {
    //     this._title = v
    // }
    // set content(v: string) {
    //     this._content = v
    // }
    // set imageId(v: string) {
    //     this._imageId = v
    // }
    // set imageUrl(v: string) {
    //     this._imageUrl = v
    // }
    // set voteCount(v: number) {
    //     this._voteCount = v
    // }
    // set voteRate(v: number) {
    //     this._voteRate = v
    // }
}
