import type { Activity5e } from 'src/foundry/dnd5e.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import type { Item5e } from 'src/types/item.types';
import type {
  ActivityItemContext,
  Actor5e,
  CharacterItemContext,
  NpcItemContext,
} from 'src/types/types';

export class Activities {
  static isConfigurable(activity: Activity5e) {
    return CONFIG.DND5E.activityTypes[activity.type]?.configurable !== false;
  }

  static getVisibleActivities(
    item: Item5e,
    activities: Activity5e[]
  ): Activity5e[] {
    // To allow the array to be completely swapped during hook calls, contain within an object.
    const visibleActivities = {
      activities:
        activities?.filter(
          (a: Activity5e) =>
            !item.getFlag('dnd5e', 'riders.activity')?.includes(a.id)
        ) ?? [],
    };

    TidyHooks.tidy5eSheetsGetActivitiesForPlay(item, visibleActivities);

    return visibleActivities.activities;
  }

  static activationMap: Record<string, string> = {
    action: 'DND5E.ActionAbbr',
    bonus: 'DND5E.BonusActionAbbr',
    reaction: 'DND5E.ReactionAbbr',
    minute: 'DND5E.TimeMinuteAbbr',
    hour: 'DND5E.TimeHourAbbr',
    day: 'DND5E.TimeDayAbbr',
  };

  static getActivityItemContext(activity: Activity5e): ActivityItemContext {
    // To Hit
    const toHit = parseInt(activity.labels.toHit);

    // Activation
    const activationAbbr =
      Activities.activationMap[activity.activation?.type || ''];

    // Limited Uses / Recharge
    const hasRecharge =
      activity.uses?.max && activity.uses.recovery?.[0]?.period === 'recharge';
    const isOnCooldown = hasRecharge && activity.uses.value < 1;

    return {
      id: activity.id,
      activity,
      hasRecharge,
      isOnCooldown,
      activation: activationAbbr
        ? `${activity.activation.value ?? ''}${game.i18n.localize(
            activationAbbr
          )}`
        : activity.labels.activation,
      save: activity.save
        ? {
            ability: activity.save.ability?.size
              ? activity.save.ability.size === 1
                ? CONFIG.DND5E.abilities[activity.save.ability.first()]
                    ?.abbreviation
                : game.i18n.localize('DND5E.AbbreviationDC')
              : null,
          }
        : null,
      toHit: isNaN(toHit) ? null : toHit,
    };
  }

  static applyLinkedUses(
    item: Item5e,
    actor: Actor5e,
    context: CharacterItemContext | NpcItemContext
  ) {
    // TODO: Change to linkedActivity
    const cachedFor = fromUuidSync(item.flags.dnd5e?.cachedFor, {
      relative: actor,
      strict: false,
    });
    if (cachedFor) {
      context.linkedUses = cachedFor.consumption?.targets.find(
        (t: any) => t.type === 'activityUses'
      )
        ? {
            ...cachedFor.uses,
            valueProp: 'uses.value',
            spentProp: 'uses.spent',
            maxProp: 'uses.max',
            doc: cachedFor,
          }
        : cachedFor.consumption?.targets.find((t: any) => t.type === 'itemUses')
        ? {
            ...cachedFor.item.system.uses,
            valueProp: 'system.uses.value',
            spentProp: 'system.uses.spent',
            maxProp: 'system.uses.max',
            doc: cachedFor.item,
          }
        : null;
    }
  }
}
