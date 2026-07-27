import type { ActiveEffect5e } from 'src/types/types';
import { isNil } from './data';
import { debug, error } from './logging';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

/**
 * Map category types from `EffectsElement.prepareCategories` to `DND5E.EffectType` 
 * labels for the switch pills.
 */
const EFFECT_CATEGORY_TYPE_LABEL_KEYS: Record<string, string> = {
  temporary: 'DND5E.EffectType.Temporary',
  passive: 'DND5E.EffectType.Passive',
  inactive: 'DND5E.EffectType.Inactive',
  suppressed: 'DND5E.EffectType.Unavailable',
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

  static getActiveEffectPills(activeEffect: ActiveEffect5e) {
    let result = [];

    if (activeEffect.disabled) {
      result.push('EFFECT.Disabled');
    }

    if (activeEffect.transfer) {
      result.push('EFFECT.Transfer');
    }

    if (activeEffect.isSuppressed) {
      result.push('DND5E.Suppressed');
    }

    Array.from<string>(activeEffect.statuses)
      .map(
        (x: string) => CONFIG.statusEffects.find((y) => y.id === x)?.name ?? x,
      )
      .forEach((e) => {
        result.push(e);
      });

    return result;
  }

  static findMode(change: any, fallback = '—') {
    if (game.release.generation >= 14) {
      const key = `EFFECT.CHANGES.TYPES.${change.type}`;
      return change.type ? FoundryAdapter.localize(key) : fallback;
    }

    const entry = Object.entries(CONST.ACTIVE_EFFECT_MODES).find(
      ([_, value]) => value === change.mode,
    );

    return entry
      ? FoundryAdapter.localize(`EFFECT.MODE_${entry[0]}`)
      : fallback;
  }
}
