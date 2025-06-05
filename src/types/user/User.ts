import CommonUtils from '@/utils/CommonUtils';
import { AbsApiObject } from '../ApiTypes';
import { UserRole } from '../UserTypes';

export default class User extends AbsApiObject {
  protected _id: string;
  private _email: string;
  private _name: string;
  private _profileImageUrl: string;
  private _userRole: UserRole;

  // next-auth 속성
  private _emailVerified: Date | null;

  constructor() {
    super();
    this._id = '';
    this._email = '';
    this._name = '';
    this._profileImageUrl = '';
    this._userRole = UserRole.GUEST;
    this._emailVerified = null;
  }

  parseResponse(json: any) {
    if (!json) {
      return;
    }

    if (json._id) this._id = String(json._id);
    if (json.email) this._email = json.email;
    if (json.name) this._name = json.name;
    if (json.profile_image_url) this._profileImageUrl = json.profile_image_url;
    if (json.userRole) this._userRole = json.userRole;
    if (json.emailVerified) {
      const parsedDate = new Date(json.emailVerified);
      if (!Number.isNaN(parsedDate.getTime())) {
        this._emailVerified = parsedDate;
      } else {
        this._emailVerified = null;
      }
    } else {
      this._emailVerified = null;
    }

    // this.ID = id !== undefined ? id : -1
    // this.Name = name !== undefined ? name : ""
    // this.Weight = weight !== undefined ? weight : ""
    // this.NormalizeWeight = normalizeWeight !== undefined ? normalizeWeight : 0
  }

  get id(): string {
    return this._id;
  }
  get email(): string {
    return this._email;
  }
  get name(): string {
    return this._name;
  }
  get profileImageUrl(): string {
    return this._profileImageUrl;
  }
  get userRole(): UserRole {
    return this._userRole;
  }

  get emailVerified(): Date | null {
    return this._emailVerified;
  }

  get isAuth(): boolean {
    return this._userRole !== UserRole.GUEST;
  }
}
