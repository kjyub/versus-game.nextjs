import React from "react"

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