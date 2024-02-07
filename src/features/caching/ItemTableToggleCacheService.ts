import type {
  ItemTableToggleCacheable,
  LocationToItemTableToggleMap,
} from 'src/types/types';
import { debug } from 'src/utils/logging';
import {
  SessionStorageManager,
  type UserDocumentSessionStorageKeyParams,
} from 'src/utils/session-storage';

type ItemTableToggleCacheServiceConstructorParams = {
  userId: string;
  documentId: string;
};

export class ItemTableToggleCacheService implements ItemTableToggleCacheable {
  private _keyParams: UserDocumentSessionStorageKeyParams;

  itemTableToggles: LocationToItemTableToggleMap;

  constructor(params: ItemTableToggleCacheServiceConstructorParams) {
    this._keyParams = {
      ...params,
      feature: 'item-table-toggles',
    };
    this.itemTableToggles = this.itemTableToggles =
      SessionStorageManager.getMap(this._keyParams) ??
      new Map<string, boolean>();
  }

  onItemTableToggle(location: string, expanded: boolean): void {
    debug('Toggled Item Table', { location, expanded });
    this.itemTableToggles.set(location, expanded);
    SessionStorageManager.storeMap(this._keyParams, this.itemTableToggles);
  }
}
