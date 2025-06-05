import type { AbsApiObject } from '../ApiTypes';
import type { IPaginationResponse } from '../common/Responses';

export default class Pagination<T extends AbsApiObject> {
  private _count: number;
  private _items: Array<T>;
  private _pageIndex: number;
  private _maxPage: number;

  constructor(count = 0, items: Array<T> = []) {
    this._count = count;
    this._items = items;
    this._pageIndex = 1;
    this._maxPage = 0;
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
  get maxPage(): number {
    return this._maxPage;
  }

  parseResponse(data: IPaginationResponse, cls: new () => T): void {
    if (Object.keys(data).length === 0) {
      return;
    }

    const items = data.items || [];

    if (Array.isArray(items)) {
      this._items = items.map((result) => {
        const instance: T = new cls();
        instance.parseResponse(result);
        return instance;
      });
    } else {
      this._items = [];
    }

    this._count = data.itemCount || 0;
    this._pageIndex = data.pageIndex || 1;
    this._maxPage = data.maxPage || 0;
  }
}
