import React from "react"

export enum GameState {
    NORMAL = 0,
    BLOCK = 1,
    STOP = 2,
}
export enum ThumbnailImageTypes {
    IMAGE = 0,
    TEXT = 1,
}
export enum ChoiceSelectStatus {
    WAIT = 0,
    SELECTED = 1,
    UNSELECTED = 2,
}
export enum PrivacyTypes {
    PUBLIC = 0,
    RESTRICTED = 1,
    PRIVATE = 2,
}
export const PrivacyTypeNames = {
    0: "전체 공개",
    1: "일부 공개",
    2: "비공개",
}

export const PrivacyTypeIcons = {
    0: <i className="fa-solid fa-eye" />,
    1: <i className="fa-solid fa-link" />,
    2: <i className="fa-solid fa-eye-slash" />,
}

// ChoiceCountType에서 choice의 개수 구할 때 사용 ex) 300 -> 3개, 1200 -> 12개
export const CHOICE_COUNT_CONST = 100 

export const GameConsts = {
    RELATED_GAME_COUNT: 10
}