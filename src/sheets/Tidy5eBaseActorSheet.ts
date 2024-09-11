import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  ActorSheetContextV1,
  DamageModificationContextEntry,
  DamageModificationData,
} from 'src/types/types';
import { debug, error } from 'src/utils/logging';

/**
 * Temporarily a utility class for common actor sheet functions.
 * Eventually planned to be a base class for Tidy 5e Sheet classes
 * after Tidy takes over all sheet logic.
 */
export class Tidy5eBaseActorSheet {
  static applyCommonContext(context: ActorSheetContextV1) {
    // Concentration
    if (
      [CONSTANTS.SHEET_TYPE_CHARACTER, CONSTANTS.SHEET_TYPE_NPC].includes(
        context.actor.type
      )
    ) {
      const attrConcentration = context.actor.system.attributes.concentration;
      if (
        context.actor.statuses.has(CONFIG.specialStatusEffects.CONCENTRATING) ||
        (FoundryAdapter.isActorSheetUnlocked(context.actor) &&
          attrConcentration)
      ) {
        (context.saves ??= {}).concentration = {
          isConcentration: true,
          label: game.i18n.localize('DND5E.Concentration'),
          abbr: game.i18n.localize('DND5E.Concentration'),
          mod: Math.abs(attrConcentration.save),
          sign:
            context.actor.system.attributes.concentration.save < 0 ? '-' : '+',
        };
      }
    }

    context.hasSpecialSaves = Object.keys(context.saves ?? {}).length > 0;

    // Damage Modification
    Tidy5eBaseActorSheet.applyDamageModifications(context);
  }

  static applyDamageModifications(context: ActorSheetContextV1) {
    try {
      // Damage modifications
      const dm: DamageModificationData | undefined =
        context.actor.system.traits?.dm;
      if (dm) {
        const rollData = context.actor.getRollData({ deterministic: true });
        const mods = Object.entries(dm.amount)
          .map(([key, value]) => {
            const total = dnd5e.utils.simplifyBonus(value, rollData);
            if (!total) return null;
            const mod: DamageModificationContextEntry = {
              label: `${
                CONFIG.DND5E.damageTypes[key]?.label ?? key
              } ${dnd5e.utils.formatNumber(total, { signDisplay: 'always' })}`,
              consequence: total > 0 ? 'detriment' : 'benefit',
            };
            const icons: string[] = (mod.icons = []);
            if (dm.bypasses.size && CONFIG.DND5E.damageTypes[key]?.isPhysical)
              icons.push(...dm.bypasses);
            return mod;
          })
          .filter((f) => f);

        context.traits.traits.dm = mods;
      }
    } catch (e) {
      error(
        'An error occurred while preparing Damage Modification data',
        false,
        e
      );
      debug('Damage Modification error troubleshooting info', { context });
    }
  }
}
