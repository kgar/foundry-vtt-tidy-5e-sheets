import type { ActiveEffect5e } from 'src/types/types';
import { isNil } from './data';
import { debug, error } from './logging';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export class ActiveEffectsHelper {
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
        e
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
        (x: string) => CONFIG.statusEffects.find((y) => y.id === x)?.name ?? x
      )
      .forEach((e) => {
        result.push(e);
      });

    return result;
  }

  static findMode(mode: number, fallback = '—') {
    const entry = Object.entries(CONST.ACTIVE_EFFECT_MODES).find(
      ([_, value]) => value === mode
    );

    if (!entry) {
      return fallback;
    }

    return FoundryAdapter.localize(`EFFECT.MODE_${entry[0]}`);
  }
}
