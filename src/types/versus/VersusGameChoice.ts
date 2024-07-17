import React from "react"
import { AbsApiObject } from "../ApiTypes"
import CommonUtils from "@/utils/CommonUtils"

export default class VersusGameChoice extends AbsApiObject {
    private _id: string
    private _gameId: string
    private _title: string
    private _content: string
    private _imageId: string
    private _imageUrl: string
    private _voteCount: number
    private _voteRate: number

    constructor() {
        super()
        this._id = ""
        this._gameId = ""
        this._title = ""
        this._content = ""
        this._imageId = ""
        this._imageUrl = ""
        this._voteCount = 0
        this._voteRate = 0
    }

    parseResponse(json: object) {
        if (json._id) this._id = String(json._id)
        if (json.gameId) this._gameId = json.gameId
        if (json.title) this._title = json.title
        if (json.content) this._content = json.content
        if (json.imageId) this._imageId = json.imageId
        if (json.imageUrl) this._imageUrl = json.imageUrl
        if (json.voteCount) this._voteCount = json.voteCount
    }

    parseRequest(): object {
        let data = {
            gameId: this._gameId,
            title: this._title,
            content: this._content,
            imageId: this._imageId,
            imageUrl: this._imageUrl,
            voteCount: this._voteCount,
        }
        if (!CommonUtils.isStringNullOrEmpty(this._id)) {
            data["_id"] = this._id
        }

        return data
    }

    get id(): string {
        return this._id
    }
    get gameId(): string {
        return this._gameId
    }
    get title(): string {
        return this._title
    }
    get content(): string {
        return this._content
    }
    get imageId(): string {
        return this._imageId
    }
    get imageUrl(): string {
        return this._imageUrl
    }
    get voteCount(): string {
        return this._voteCount
    }
    get voteRate(): string {
        return this._voteRate
    }

    set title(v: string) {
        this._title = v
    }
    set content(v: string) {
        this._content = v
    }
    set imageId(v: string) {
        this._imageId = v
    }
    set imageUrl(v: string) {
        this._imageUrl = v
    }
    set voteCount(v: number) {
        this._voteCount = v
    }
    set voteRate(v: number) {
        this._voteRate = v
    }
}
