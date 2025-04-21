export enum EditTypes {
  ADD,
  MODIFY,
  REMOVE,
}

export enum EditStateTypes {
  WAIT,
  DISABLED,
  EDITED,
  PENDING,
  DONE,
  FAILED,
}

export interface Paging<T> {
  pageCount: number
  datas: Array<T>
}

export const PagingBlank = {
  pageCount: 1,
  datas: [],
}

export enum DataTypes {
  TEXT,
  IMAGE,
}
