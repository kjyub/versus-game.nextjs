import CommonUtils from "@/utils/CommonUtils"

export const REQUEST_TYPE_INSERT = "REQUEST_TYPE_INSERT"
export const REQUEST_TYPE_UPDATE = "REQUEST_TYPE_UPDATE"
export const REQUEST_TYPE_DELETE = "REQUEST_TYPE_DELETE"
export const REQUEST_TYPE_SELECT = "REQUEST_TYPE_SELECT"
export const REQUEST_TYPE_INSERT_OR_UPDATE = "REQUEST_TYPE_INSERT_OR_UPDATE"

export enum QueryTypes {
    Insert,
    Select,
    Update,
    Delete,
    InsertOrUpdate,
}

export abstract class AbsApiObject {
    private _id: string

    constructor() {
        this._id = ""
    }

    isEmpty(): boolean {
        return CommonUtils.isStringNullOrEmpty(this._id)
    }
    parseResponse(json: object) {}
    parseRequest(): object {}
    stringifyRequest(): object {}
}
