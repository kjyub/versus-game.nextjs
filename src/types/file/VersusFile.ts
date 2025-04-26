import ApiUtils from "@/utils/ApiUtils";
import { AbsApiObject } from "../ApiTypes";

export default class VersusFile extends AbsApiObject {
  private _id: string;
  private _url: string;
  private _fileName: string;
  private _size: number;
  private _isDeleted: boolean;

  constructor() {
    super();
    this._id = "";
    this._url = "";
    this._fileName = "";
    this._size = "";
    this._isDeleted = "";
  }

  parseResponse(json: object) {
    if (json._id) this._id = String(json._id);
    if (json.url) this._url = json.url;
    if (json.fileName) this._fileName = json.fileName;
    if (json.size) this._size = json.size;
    if (json.isDeleted) this._isDeleted = json.isDeleted;
  }
  mediaUrl() {
    return ApiUtils.mediaUrl(this._url);
  }

  toRawData(): object {
    const json = {
      _id: this._id,
      url: this._url,
      fileName: this._fileName,
      size: this._size,
      isDeleted: this._isDeleted,
    };
    return json;
  }

  get id(): string {
    return this._id;
  }
  get url(): string {
    return this._url;
  }
  get fileName(): string {
    return this._fileName;
  }
  get size(): number {
    return this._size;
  }
  get isDeleted(): boolean {
    return this._isDeleted;
  }
}
