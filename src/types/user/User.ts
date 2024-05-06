import React from "react"
import { AbsApiObject } from "../ApiTypes"

export default class User extends AbsApiObject {
    private _id: number
    private _email: string
    private _name: string
    private _profileImageUrl: string

    constructor() {
        super()
        this._id = -1
        this._email = ""
        this._name = ""
        this._profileImageUrl = ""
    }

    parseResponse(json: object) {
        if (json.id) this._id = json.id
        if (json.email) this._email = json.email
        if (json.name) this._name = json.name
        if (json.profile_image_url)
            this._profileImageUrl = json.profile_image_url

        // this.ID = id !== undefined ? id : -1
        // this.Name = name !== undefined ? name : ""
        // this.Weight = weight !== undefined ? weight : ""
        // this.NormalizeWeight = normalizeWeight !== undefined ? normalizeWeight : 0
    }

    get id(): number {
        return this._id
    }
    get email(): string {
        return this._email
    }
    get name(): string {
        return this._name
    }
    get profileImageUrl(): string {
        return this._profileImageUrl
    }
}
