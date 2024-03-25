import type {
  Actor5e,
  ActorSheetContext,
  DamageModificationContextEntry,
  DamageModificationData,
} from 'src/types/types';

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

      if (mods.length) {
        context.traits.traits.dm = mods;
      }
    }
  }
}
