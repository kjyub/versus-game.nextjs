import { IPaginationResponse } from "../common/Responses";
import { AbsApiObject } from "../ApiTypes";
export default class Pagination<T extends AbsApiObject> {
  private _count: number;
  private _items: Array<T>;
  private _pageIndex: number;

  constructor(count: number = 0, items: Array<T> = []) {
    this._count = count;
    this._items = items;
    this._pageIndex = 1;
  }

  get count(): number {
    return this._count;
  }
  get items(): Array<T> {
    return this._items;
  }
  get pageIndex(): number {
    return this._pageIndex;
  }

  parseResponse(data: IPaginationResponse, cls: new () => T): void {
    if (data === {}) {
      return;
    }

    const items = data.items || [];

    if (Array.isArray(items)) {
      this._items = items.map((result) => {
        let instance: T = new cls();
        instance.parseResponse(result);
        return instance;
      });
    } else {
      this._items = [];
    }

    this._count = data.itemCount || 0;
    this._pageIndex = data.pageIndex || 1;
  }
}
