import CommonUtils from './CommonUtils';

// 로컬, 세션 스토리지 관련 유틸

namespace StorageUtils {
  export function getSessionStorageList(storageKey: string): Array<any> {
    if (!storageKey) {
      return [];
    }

    const storageItem = sessionStorage.getItem(storageKey);
    if (!storageItem) {
      return [];
    }

    try {
      const storageList = JSON.parse(storageItem);
      return storageList;
    } catch {
      return [];
    }
  }
  export function pushSessionStorageList(storageKey: string, value: string) {
    const data: Array<any> = StorageUtils.getSessionStorageList(storageKey);
    data.push(value);

    const storageList = JSON.stringify(data);
    sessionStorage.setItem(storageKey, storageList);
  }
}

export default StorageUtils;
