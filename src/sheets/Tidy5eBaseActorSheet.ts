import type {
  ActorSheetContext,
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
  static applyCommonContext(context: ActorSheetContext) {
    Tidy5eBaseActorSheet.applyDamageModifications(context);
  }

  static applyDamageModifications(context: ActorSheetContext) {
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
