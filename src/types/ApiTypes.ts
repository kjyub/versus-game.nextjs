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

export const CookieConsts = {
    GUEST_ID: "guest_id",
    GAME_VIEWED_SESSION: "session_game_viewed", // 게임의 nanoId 리스트를 저장, 게임 조회 여부를 임시로 저장
    GAME_CHOICED_SESSION: "session_game_choiced", // 게임의 nanoId 리스트를 저장, 게임 참여 여부를 임시로 저장
    GAME_LIST_DATA_SESSION: "session_game_list_data" // 게임 리스트 페이지의 현재 상태를 저장. 뒤로가기 시 이전 상태로 다시 되돌아오기 위함
}

export type ApiParamsType = {
    params: {
        [key: string]: string
    }
}