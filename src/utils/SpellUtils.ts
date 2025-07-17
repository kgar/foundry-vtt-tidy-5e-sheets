import { settings } from 'src/settings/settings.svelte';
import type { Item5e } from 'src/types/item.types';
import { ItemUtils } from './ItemUtils';
import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { Actor5e } from 'src/types/types';
import { isNil } from './data';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export class SpellUtils {
  /** Is a cantrip. */
  static isCantrip(item: Item5e) {
    return item.type === CONSTANTS.ITEM_TYPE_SPELL && item.system.level === 0;
  }

  /** The cantrip is castable. If cantrip preparation is turned on, then require the cantrip to be prepared to be castable. */
  static isCastableCantrip(item: Item5e) {
    return (
      SpellUtils.isCantrip(item) &&
      (SpellUtils.isCantripPrepared(item) ||
        SpellUtils.isAlwaysPrepared(item) ||
        SpellUtils.isUnlimitedAtWill(item) ||
        SpellUtils.isUnlimitedInnate(item) ||
        ItemUtils.hasSufficientLimitedUses(item))
    );
  }

  /** While the Cantrip Formulas rule is enabled, this cantrip must have prepared status. If the rule is not enabled, a cantrip is always prepared.  */
  static isCantripPrepared(item: Item5e) {
    const prepareCantrips = settings.value.allowCantripsToBePrepared;

    return !prepareCantrips || (prepareCantrips && SpellUtils.isPrepared(item));
  }

  /** Spell is castable in this moment. */
  static isCastableSpell(item: Item5e) {
    return (
      SpellUtils.isSpell(item) &&
      (SpellUtils.isPrepared(item) ||
        SpellUtils.isAlwaysPrepared(item) ||
        SpellUtils.isUnlimitedAtWill(item) ||
        SpellUtils.isUnlimitedInnate(item) ||
        ItemUtils.hasSufficientLimitedUses(item) ||
        SpellUtils.isPactMagic(item) ||
        SpellUtils.isRitualSpellForRitualCaster(item))
    );
  }

  static isRitualSpellForRitualCaster(item: any) {
    return (
      item.system.properties.has(CONSTANTS.SPELL_PROPERTY_RITUAL) &&
      item.parent &&
      TidyFlags.includeRitualsInCanCast.get(item.parent)
    );
  }

  /** A spell item with a non-cantrip level. */
  static isSpell(item: any) {
    return item.type === CONSTANTS.ITEM_TYPE_SPELL && item.system.level > 0;
  }

  /** Spell is always prepared. */
  static isAlwaysPrepared(item: any): any {
    return (
      item.system.canPrepare &&
      item.system.prepared === CONFIG.DND5E.spellPreparationStates.always.value
    );
  }

  /** Is an At-Will spell with no limit on uses. */
  static isUnlimitedAtWill(item: any): boolean {
    return SpellUtils.isAtWill(item) && !ItemUtils.hasConfiguredUses(item);
  }

  /** Is an At-Will spell. */
  static isAtWill(item: any): boolean {
    return (
      item.system.preparation?.mode ===
      CONSTANTS.SPELL_PREPARATION_METHOD_ATWILL
    );
  }

  /** Is an Innate spell with no limit on uses. */
  static isUnlimitedInnate(item: any): boolean {
    return SpellUtils.isInnate(item) && !ItemUtils.hasConfiguredUses(item);
  }

  /** Is an Innate spell. */
  static isInnate(item: any): boolean {
    return (
      item.system.preparation?.mode ===
      CONSTANTS.SPELL_PREPARATION_METHOD_INNATE
    );
  }

  /** Is pact magic. */
  static isPactMagic(item: Item5e) {
    return (
      item.system.preparation?.mode === CONSTANTS.SPELL_PREPARATION_METHOD_PACT
    );
  }

  /** Is a spell that requires preparation and is prepared. */
  static isPrepared(item: Item5e) {
    return (
      FoundryAdapter.canPrepareSpell(item) &&
      item.system.prepared ===
        CONFIG.DND5E.spellPreparationStates.prepared.value
    );
  }

  /** Is a spell that requires preparation but is unprepared. */
  static isUnprepared(item: Item5e) {
    return (
      FoundryAdapter.canPrepareSpell(item) &&
      item.system.prepared ===
        CONFIG.DND5E.spellPreparationStates.unprepared.value
    );
  }

  static getToggleTitle(item: Item5e) {
    const prep = item.system.preparation || {};
    const isAlways = prep.mode === 'always';
    const isPrepared = !!prep.prepared;

    if (isAlways) {
      return CONFIG.DND5E.spellPreparationStates.always.label;
    } else if (isPrepared) {
      return CONFIG.DND5E.spellPreparationStates.prepared.label;
    }

    return game.i18n.localize('DND5E.SpellUnprepared');
  }

  static tryFilterByClass(
    actor: Actor5e,
    spells: any[],
    selectedClassFilter?: string
  ) {
    const classesCount = Object.keys(actor.classes ?? {}).length;

    if (classesCount < 2 || isNil(selectedClassFilter, '')) {
      return spells;
    }

    return spells.filter(
      (spell) =>
        spell.system.sourceClass?.trim() === selectedClassFilter?.trim()
    );
  }
}
