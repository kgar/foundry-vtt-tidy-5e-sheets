import { debug, error } from './logging';

export type UserDocumentSessionStorageKeyParams = {
  userId: string;
  documentId: string;
  feature: string;
};

export class SessionStorageManager {
  private static _createKey(keyParams: UserDocumentSessionStorageKeyParams) {
    return `user-${keyParams.userId}|document-${keyParams.documentId}|${keyParams.feature}`;
  }

  static storeMap<Key, Value>(
    keyParams: UserDocumentSessionStorageKeyParams,
    map: Map<Key, Value>
  ) {
    try {
      const serializedMap = JSON.stringify(Array.from(map));
      sessionStorage.setItem(
        SessionStorageManager._createKey(keyParams),
        serializedMap
      );
    } catch (e) {
      error(
        'An error occurred while storing cached data in session storage',
        false,
        e
      );
      debug('Troubleshooting information', { keyParams, map });
    }
  }

  static getMap<Key, Value>(
    keyParams: UserDocumentSessionStorageKeyParams
  ): Map<Key, Value> | undefined {
    try {
      const data = sessionStorage.getItem(
        SessionStorageManager._createKey(keyParams)
      );
      return data ? new Map(JSON.parse(data)) : undefined;
    } catch (e) {
      error(
        'An error occurred while fetching cached data in session storage',
        false,
        e
      );
      debug('Troubleshooting information', { keyParams });
    }
  }
}
