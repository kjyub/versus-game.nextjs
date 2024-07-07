import React from "react"
import { AbsApiObject } from "../ApiTypes"
import VersusGameChoice from "./VersusGameChoice"

const CHOICE_COUNT = 10

export default class VersusGame extends AbsApiObject {
    private _id: string
    private _title: string
    private _content: string
    private _userId: string
    private _thumbnailImageId: string
    private _thumbnailImageUrl: string
    private _thumbnailImageUrl: THUMBNAIL_IMAGE_TYPE
    private _views: number
    private _favs: number

    private _choices: Array<VersusGameChoice>

    constructor() {
        super()
        this._id = ""
        this._title = ""
        this._content = ""
        this._userId = ""
        this._thumbnailImageId = ""
        this._thumbnailImageUrl = ""
        this._views = ""
        this._favs = ""

        this._choices = []
        for (let i = 0; i < CHOICE_COUNT; i++) {
            this._choices.push(new VersusGameChoice())
        }
    }

    parseResponse(json: object) {
        if (json._id) this._id = String(json._id)
        if (json.title) this._title = json.title
        if (json.content) this._content = json.content
        if (json.userId) this._userId = json.userId
        if (json.thumbnailImageId)
            this._thumbnailImageId = json.thumbnailImageId
        if (json.thumbnailImageUrl)
            this._thumbnailImageUrl = json.thumbnailImageUrl
        if (json.views) this._views = json.views
        if (json.favs) this._favs = json.favs

        if (json.choices && Array.isArray(json.choices)) {
            let newChoices: Array<VersusGameChoice> = []
            json.choices.map((choiceData: any) => {
                const _choice = new VersusGameChoice()
                _choice.parseResponse(choiceData)
                newChoices.push(_choice)
            })
            this._choices = newChoices
        }
    }

    get id(): string {
        return this._id
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
    get views(): string {
        return this._views
    }
    get favs(): string {
        return this._favs
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
