import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import type { SheetPreferences } from 'src/features/user-preferences/user-preferences.types';
import { writable, type Readable } from 'svelte/store';

export class SheetPreferencesRuntime {
  private static _store = writable<SheetPreferences>();

  static init() {
    this._store.set(SheetPreferencesService.get());
    Hooks.on('updateUser', (user: any) => {
      if (game.user === user) {
        this._store.set(SheetPreferencesService.get());
      }
    });
  }

  static getStore(): Readable<SheetPreferences> {
    return this._store;
  }
}
