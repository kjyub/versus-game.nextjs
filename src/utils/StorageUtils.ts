import CommonUtils from './CommonUtils'

// 로컬, 세션 스토리지 관련 유틸

export default class StorageUtils {
  static getSessionStorageList(storageKey: string): Array<any> {
    if (CommonUtils.isStringNullOrEmpty(storageKey)) {
      return []
    }

    const storageItem = sessionStorage.getItem(storageKey)
    if (CommonUtils.isStringNullOrEmpty(storageItem)) {
      return []
    }

    try {
      const storageList = JSON.parse(storageItem)
      return storageList
    } catch {
      return []
    }
  }
  static pushSessionStorageList(storageKey: string, value: string) {
    let data: Array<any> = this.getSessionStorageList(storageKey)
    data.push(value)

    const storageList = JSON.stringify(data)
    sessionStorage.setItem(storageKey, storageList)
  }
}
