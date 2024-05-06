export default class Pagination<T> {
    private _count: number
    private _items: Array<T>

    constructor(count: number = 0, items: Array<T> = []) {
        this._count = count
        this._items = items
    }
    get count(): number {
        return this._count
    }
    get items(): Array<T> {
        return this._items
    }
}
