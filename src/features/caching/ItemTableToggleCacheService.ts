import { debug } from 'src/utils/logging';
import {
  SessionStorageManager,
  type UserDocumentSessionStorageKeyParams,
} from 'src/utils/session-storage';

type ItemTableToggleCacheServiceConstructorParams = {
  userId: string;
  documentId: string;
};

export type OnItemTableToggleFn =
  ItemTableToggleCacheService['onItemTableToggle'];

export class ItemTableToggleCacheService {
  private _keyParams: UserDocumentSessionStorageKeyParams;

  itemTableToggles: Map<string, boolean>;

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
