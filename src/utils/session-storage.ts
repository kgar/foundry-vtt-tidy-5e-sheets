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
    const serializedMap = JSON.stringify(Array.from(map.entries()));
    sessionStorage.setItem(
      SessionStorageManager._createKey(keyParams),
      serializedMap
    );
  }

  static getMap<Key, Value>(
    keyParams: UserDocumentSessionStorageKeyParams
  ): Map<Key, Value> | undefined {
    const data = sessionStorage.getItem(
      SessionStorageManager._createKey(keyParams)
    );
    if (!data) {
      return undefined;
    }

    try {
      return new Map(JSON.parse(data));
    } catch (e) {
      error('An error occurred while fetching cached map data', false, e);
      debug('Troubleshooting information', { keyParams });
    }
  }
}
