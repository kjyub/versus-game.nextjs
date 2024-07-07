import React from "react"
import { AbsApiObject } from "../ApiTypes"
import CommonUtils from "@/utils/CommonUtils"
import ApiUtils from "@/utils/ApiUtils"

export default class VersusFile extends AbsApiObject {
    private _id: string
    private _url: string
    private _fileName: string
    private _size: number
    private _isDeleted: boolean

    constructor() {
        super()
        this._id = ""
        this._url = ""
        this._fileName = ""
        this._size = ""
        this._isDeleted = ""
    }

    parseResponse(json: object) {
        if (json._id) this._id = String(json._id)
        if (json.url) this._url = json.url
        if (json.fileName) this._fileName = json.fileName
        if (json.size) this._size = json.size
        if (json.isDeleted) this._isDeleted = json.isDeleted
    }
    mediaUrl() {
        return ApiUtils.mediaUrl(this._url)
    }

    get id(): string {
        return this._id
    }
    get url(): string {
        return this._url
    }
    get fileName(): string {
        return this._fileName
    }
    get size(): number {
        return this._size
    }
    get isDeleted(): boolean {
        return this._isDeleted
    }
}
