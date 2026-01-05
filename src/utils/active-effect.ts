import type { ActiveEffect5e } from 'src/types/types';
import { isNil } from './data';
import { debug, error } from './logging';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyHooks } from 'src/foundry/TidyHooks';

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

  static addEffect(effectType: string, parent: any) {
    const isActor = parent instanceof Actor;

    const effectData = {
      name: isActor ? game.i18n.localize('DND5E.EffectNew') : parent.name,
      icon: isActor ? 'icons/svg/aura.svg' : parent.img,
      origin: parent.uuid,
      'duration.rounds': effectType === 'temporary' ? 1 : undefined,
      disabled: effectType === 'inactive',
    };

    if (
      !TidyHooks.tidy5eSheetsPreCreateActiveEffect(
        parent,
        effectData,
        game.user.id
      )
    ) {
      return;
    }

    return ActiveEffect.implementation.create(effectData, {
      parent: parent,
      renderSheet: true,
    });
  }
}
