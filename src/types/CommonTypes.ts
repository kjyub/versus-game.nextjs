export enum TextFormats {
  TEXT = 0,
  NUMBER = 1,
  NUMBER_ONLY = 2,
  PRICE = 3,
  TEL = 4,
}

export type objectType = {
  [key: string | number]: any;
};

export interface IListState {
  pageIndex: number;
  lastId: string;
  items: Array<any>;
  scrollLocation: number;
}
