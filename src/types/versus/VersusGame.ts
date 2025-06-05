import { AbsApiObject } from '../ApiTypes';
import { GameState, PrivacyTypes, ThumbnailImageTypes } from '../VersusTypes';
import VersusFile from '../file/VersusFile';
import User from '../user/User';
import VersusGameChoice from './VersusGameChoice';

const CHOICE_COUNT = 10;

export default class VersusGame extends AbsApiObject {
  protected _id: string;
  private _nanoId: string;
  private _title: string;
  private _content: string;
  private _userId: string;
  private _images: Array<VersusFile>;
  private _choiceCount: number;
  private _privacyType: PrivacyTypes;
  private _views: number;
  private _favs: number;
  private _answerCount: number;
  private _state: GameState;

  private _choices: Array<VersusGameChoice>;

  // 임의 정의
  private _user: User;
  private _isView: boolean; // 사용자가 게임을 조회 했었는지 여부
  private _isChoice: boolean; // 사용자가 게임을 선택 했었는지 여부

  private _relatedGames: Array<VersusGame>;

  constructor() {
    super();
    this._id = '';
    this._nanoId = '';
    this._title = '';
    this._content = '';
    this._userId = '';
    this._images = [];
    this._privacyType = PrivacyTypes.PUBLIC;
    this._choiceCount = 4;
    this._views = 0;
    this._favs = 0;
    this._answerCount = 0;
    this._state = GameState.NORMAL;

    this._choices = [];
    for (let i = 0; i < CHOICE_COUNT; i++) {
      this._choices.push(new VersusGameChoice());
    }

    this._user = new User();
    this._isView = false;
    this._isChoice = false;

    this._relatedGames = [];
  }

  parseResponse(json: any) {
    if (json._id) this._id = String(json._id);
    if (json.nanoId) this._nanoId = String(json.nanoId);
    if (json.title) this._title = json.title;
    if (json.content) this._content = json.content;
    if (json.userId) this._userId = json.userId;
    if (json.images && Array.isArray(json.images)) {
      this._images = [];
      json.images.map((_data: any) => {
        const image = new VersusFile();
        image.parseResponse(_data);
        this._images.push(image);
      });
    }
    if (json.privacyType) this._privacyType = json.privacyType;
    if (json.choiceCount) this._choiceCount = json.choiceCount;
    if (json.views) this._views = json.views;
    if (json.favs) this._favs = json.favs;
    if (json.answerCount) this._answerCount = json.answerCount;
    if (json.state) this._state = json.state;

    if (json.choices && Array.isArray(json.choices)) {
      const newChoices: Array<VersusGameChoice> = [];
      json.choices
        .filter((choiceData: any) => choiceData.title)
        .map((choiceData: any) => {
          const _choice = new VersusGameChoice();
          _choice.parseResponse(choiceData);
          newChoices.push(_choice);
        });
      this._choices = newChoices;
    }

    if (json.user && typeof json.user === 'object') {
      this._user = new User();
      this._user.parseResponse(json.user);
    }
    if (json.isView) {
      this._isView = json.isView;
    }
    if (json.isChoice) {
      this._isChoice = json.isChoice;
    }

    if (json.relatedGames && Array.isArray(json.relatedGames)) {
      this._relatedGames = [];
      json.relatedGames.map((_data: any) => {
        const relatedGame = new VersusGame();
        relatedGame.parseResponse(_data);
        this._relatedGames.push(relatedGame);
      });
    }
  }

  toRawData(): object {
    const json = {
      _id: this._id,
      nanoId: this._nanoId,
      title: this._title,
      content: this._content,
      userId: this._userId,
      images: this._images.map((image) => image.toRawData()),
      privacyType: this._privacyType,
      choiceCount: this._choiceCount,
      views: this._views,
      favs: this._favs,
      answerCount: this._answerCount,
      state: this._state,
      choices: this._choices.map((choice) => choice.toRawData()),
      user: this._user,
      isView: this._isView,
      isChoice: this._isChoice,
      relatedGames: this._relatedGames.map((game) => game.toRawData()),
    };
    return json;
  }

  get id(): string {
    return this._id;
  }
  get nanoId(): string {
    return this._nanoId;
  }
  get title(): string {
    return this._title;
  }
  get content(): string {
    return this._content;
  }
  get userId(): string {
    return this._userId;
  }
  get images(): Array<VersusFile> {
    return this._images;
  }
  get privacyType(): PrivacyTypes {
    return this._privacyType;
  }
  get choiceCount(): number {
    return this._choiceCount;
  }
  get views(): number {
    return this._views;
  }
  get favs(): number {
    return this._favs;
  }
  get answerCount(): number {
    return this._answerCount;
  }
  get state(): GameState {
    return this._state;
  }
  get user(): User {
    return this._user;
  }
  get isView(): boolean {
    return this._isView;
  }
  get isChoice(): boolean {
    return this._isChoice;
  }
  get relatedGames(): Array<VersusGame> {
    return this._relatedGames;
  }

  set title(v: string) {
    this._title = v;
  }
  set content(v: string) {
    this._content = v;
  }
  set images(v: Array<VersusFile>) {
    this._images = v;
  }
  set privacyType(v: PrivacyTypes) {
    this._privacyType = v;
  }
  set choiceCount(v: number) {
    this._choiceCount = v;
  }
  set state(v: GameState) {
    this._state = v;
  }
  set isView(v: boolean) {
    this._isView = v;
  }
  set isChoice(v: boolean) {
    this._isChoice = v;
  }
  set choices(v: Array<VersusGameChoice>) {
    this._choices = v;
  }

  get choices(): Array<VersusGameChoice> {
    return this._choices;
  }

  updateChoice(index: number, _choice: VersusGameChoice) {
    if (index < 0) return;

    this._choices[index] = _choice;
  }
}
