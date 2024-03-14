import { SettingsProvider } from 'src/settings/settings';
import type { Item5e } from 'src/types/item.types';
import { ItemUtils } from './item';
import { CONSTANTS } from 'src/constants';

export class SpellUtils {
  /** Is a cantrip. */
  static isCantrip(item: Item5e) {
    return item.type === CONSTANTS.ITEM_TYPE_SPELL && item.system.level === 0;
  }

  /** The cantrip is castable. If cantrip preparation is turned on, then require the cantrip to be prepared to be castable. */
  static isCastableCantrip(item: Item5e) {
    const prepareCantrips =
      SettingsProvider.settings.allowCantripsToBePrepared.get();
    return (
      SpellUtils.isCantrip(item) &&
      (!prepareCantrips ||
        (prepareCantrips && SpellUtils.isPrepared(item)) ||
        SpellUtils.isAlwaysPrepared(item) ||
        SpellUtils.isAtWill(item) ||
        SpellUtils.isInnate(item) ||
        ItemUtils.hasUses(item))
    );
  }

  /** Spell is castable in this moment. */
  static isCastableSpell(item: Item5e) {
    return (
      SpellUtils.isSpell(item) &&
      (SpellUtils.isPrepared(item) ||
        SpellUtils.isAlwaysPrepared(item) ||
        SpellUtils.isAtWill(item) ||
        SpellUtils.isInnate(item) ||
        ItemUtils.hasUses(item) ||
        SpellUtils.isPactMagic(item))
    );
  }

  static isSpell(item: any) {
    return item.type === CONSTANTS.ITEM_TYPE_SPELL && item.system.level > 0;
  }

  /** Spell is always prepared. */
  static isAlwaysPrepared(item: any): any {
    return (
      item.system.preparation?.mode === CONSTANTS.SPELL_PREPARATION_MODE_ALWAYS
    );
  }

  /** Is an At-Will spell. */
  static isAtWill(item: any): boolean {
    return (
      item.system.preparation?.mode === CONSTANTS.SPELL_PREPARATION_MODE_ATWILL
    );
  }

  /** Is an Innate spell. */
  static isInnate(item: any): boolean {
    return (
      item.system.preparation?.mode === CONSTANTS.SPELL_PREPARATION_MODE_INNATE
    );
  }

  static isPactMagic(item: Item5e) {
    return (
      item.system.preparation?.mode === CONSTANTS.SPELL_PREPARATION_MODE_PACT
    );
  }

  /** Is a spell that requires preparation and is prepared. */
  static isPrepared(item: Item5e) {
    return (
      item.system.preparation?.mode === 'prepared' &&
      item.system.preparation?.prepared
    );
  }

  /** Is a spell that requires preparation but is unprepared. */
  static isUnprepared(item: Item5e) {
    return (
      item.system.preparation?.mode === 'prepared' &&
      !item.system.preparation?.prepared
    );
  }
}
