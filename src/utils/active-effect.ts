import { CONSTANTS } from 'src/constants';
import type { Item5e } from 'src/types/item.types';
import type { ActiveEffect5e, EffectPill } from 'src/types/types';
import { isNil } from './data';
import { debug, error } from './logging';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

/**
 * Icons to make the effect changes clearer.
 */
const EFFECT_CHANGE_TYPE_ICONS: Record<string, string> = {
  // Standard change types
  add: 'fa-circle-plus',
  subtract: 'fa-circle-minus',
  multiply: 'fa-circle-x',
  downgrade: 'fa-circle-down',
  upgrade: 'fa-circle-up',
  override: 'fa-pen-circle',
  custom: 'fa-code',
  // Rule change types from `CONFIG.DND5E.activeEffectChangeTypes`.
  'dnd5e.advantage': 'fa-dice-d20',
  'dnd5e.bonus': 'fa-plus-minus',
  'dnd5e.maximum': 'fa-arrow-up-to-line',
  'dnd5e.minimum': 'fa-arrow-down-to-line',
};

/**
 * Labels for effect category types.
 */
const EFFECT_CATEGORY_TYPE_LABEL_KEYS: Record<string, string> = {
  temporary: 'DND5E.EFFECT.Status.Temporary',
  passive: 'DND5E.EFFECT.Status.Passive',
  inactive: 'DND5E.EFFECT.Status.Inactive',
  suppressed: 'DND5E.EFFECT.Status.Unavailable',
};

export class ActiveEffectsHelper {
  /**
   * Get the short-form label for an effect category, e.g. "Passive" for the
   * "Passive Effects" category. Falls back to the category's own label for any
   * category the system adds later.
   */
  static getEffectCategoryTypeLabel(category: {
    type: string;
    label: string;
  }): string {
    return EFFECT_CATEGORY_TYPE_LABEL_KEYS[category.type] ?? category.label;
  }

  /**
   * Get the display name of a status effect.
   */
  static getStatusEffectName(statusId: string): string | undefined {
    const statusEffects = CONFIG.statusEffects as any;
    return statusEffects[statusId]?.name;
  }

  /**
   * Map each rider effect ID on an item to the names of the enchantment effects
   * that apply it so that we can show tooltips.
   */
  static getRiderEffectParentNames(item: Item5e): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    const enchantmentEffects =
      item.system?.activities
        ?.getByType('enchant')
        ?.flatMap((activity: any) => activity.effects) ?? [];

    for (const enchantmentEffect of enchantmentEffects) {
      const parentName = item.effects.get(enchantmentEffect._id)?.name;

      if (!parentName) {
        continue;
      }

      for (const riderId of enchantmentEffect.riders?.effect ?? []) {
        (result[riderId] ??= []).push(parentName);
      }
    }

    return result;
  }

  static isActiveEffectAppliedToField(document: any, field: string) {
    try {
      return (
        document?.overrides &&
        !isNil(field) &&
        !!foundry.utils.getProperty(document.overrides, field)
      );
    } catch (e) {
      error(
        'An error occurred while checking if a field has an active effect applied',
        false,
        e,
      );
      debug('Active effect error troubleshooting info', { document, field });
      return false;
    }
  }

  static getActiveEffectPills(activeEffect: ActiveEffect5e): EffectPill[] {
    const isEnchantment =
      activeEffect.type === CONSTANTS.EFFECT_TYPE_ENCHANTMENT;

    let result: EffectPill[] = [];

    Array.from<string>(activeEffect.statuses)
      .map((x: string) => ActiveEffectsHelper.getStatusEffectName(x) ?? x)
      .forEach((e) => {
        result.push({ label: e });
      });

    // Follow system ActiveEffect5e#getPreviewContext` in active-effect.mjs
    if (activeEffect.isSuppressed) {
      result.push({ label: 'DND5E.EFFECT.Status.Unavailable' });
    } else if (activeEffect.disabled) {
      result.push({ label: 'DND5E.EFFECT.Status.Inactive' });
    } else if (activeEffect.isTemporary) {
      result.push({ label: 'DND5E.EFFECT.Status.Temporary' });
    } else {
      result.push({ label: 'DND5E.EFFECT.Status.Passive' });
    }

    // Show the system "transfer" label (applies to parent)
    if (activeEffect.transfer && isEnchantment) {
      result.push({
        label: 'DND5E.ENCHANTMENT.Transfer.Label',
      });
    }

    if (isEnchantment) {
      result.push({ label: 'DND5E.ENCHANTMENT.Label' });
    }

    // Shows the system description for `magical` effects.
    if (activeEffect.system?.magical) {
      result.push(
        isEnchantment
          ? {
              label: 'DND5E.ENCHANTMENT.FIELDS.magical.label',
              tooltip: 'DND5E.ENCHANTMENT.FIELDS.magical.hint',
            }
          : {
              label: 'DND5E.EFFECT.BASE.FIELDS.magical.label',
              tooltip: 'DND5E.EFFECT.BASE.FIELDS.magical.hint',
            },
      );
    }

    return result;
  }

  static findMode(change: any, fallback = '—') {
    if (!change.type) {
      return fallback;
    }


    // First look for system rule change types (e.g. `dnd5e.advantage`), otherwise
    // look for the Foundry standard change types (e.g. `add`).
    const key =
      ActiveEffect.CHANGE_TYPES[change.type]?.label ??
      `EFFECT.CHANGES.TYPES.${change.type}`;

    return FoundryAdapter.localize(key);
  }

  /**
   * Get the icon that stands in for a change's mode, e.g. a plus sign for `add`.
   * Neither Foundry nor the system maps change types to icons, so this mapping
   * is Tidy's own; unrecognized types (modules can register their own) get none.
   */
  static findModeIcon(change: any): string | undefined {
    return EFFECT_CHANGE_TYPE_ICONS[change.type];
  }
}
