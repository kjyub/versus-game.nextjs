import ApiUtils from '@/utils/ApiUtils';
import CommonUtils from '@/utils/CommonUtils';
import { AbsApiObject } from '../ApiTypes';

export default class VersusGameChoice extends AbsApiObject {
  protected _id: string;
  private _gameId: string;
  private _title: string;
  private _content: string;
  private _voteCount: number;
  private _voteRate: number;

  constructor() {
    super();
    this._id = '';
    this._gameId = '';
    this._title = '';
    this._content = '';
    this._voteCount = 0;
    this._voteRate = 0;
  }

  parseResponse(json: any) {
    if (json._id) this._id = String(json._id);
    if (json.gameId) this._gameId = json.gameId;
    if (json.title) this._title = json.title;
    if (json.content) this._content = json.content;
    if (json.voteCount) this._voteCount = json.voteCount;
  }

  parseRequest(): object {
    const data: Record<string, any> = {
      gameId: this._gameId,
      title: this._title,
      content: this._content,
      voteCount: this._voteCount,
    };
    if (this._id) {
      data._id = this._id;
    }

    return data;
  }

  toRawData(): object {
    const json = {
      _id: this._id,
      gameId: this._gameId,
      title: this._title,
      content: this._content,
      voteCount: this._voteCount,
      voteRate: this._voteRate,
    };
    return json;
  }

  get id(): string {
    return this._id;
  }
  get gameId(): string {
    return this._gameId;
  }
  get title(): string {
    return this._title;
  }
  get content(): string {
    return this._content;
  }
  get voteCount(): number {
    return this._voteCount;
  }
  get voteRate(): number {
    return this._voteRate;
  }

  set title(v: string) {
    this._title = v;
  }
  set content(v: string) {
    this._content = v;
  }
  set voteCount(v: number) {
    this._voteCount = v;
  }
  set voteRate(v: number) {
    this._voteRate = v;
  }
}
