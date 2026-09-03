import type { Activity5e } from 'src/foundry/dnd5e.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import type { Item5e } from 'src/types/item.types';
import type { ActivityItemContext, LinkedUses } from 'src/types/types';
import { ActivityRowActionRuntime } from 'src/runtime/table-row-actions/ActivityRowActionRuntime.svelte';

export class Activities {
  static isConfigurable(activity: Activity5e) {
    return activity.canConfigure;
  }

  /**
   * 5e system v6.0+ separates display (`isHidden`) from usability (`canUse`).
   */
  static isActivityVisible(activity: Activity5e): boolean {
    return 'isHidden' in activity ? !activity.isHidden : activity.canUse;
  }

  // TODO: Tidy this up and remove `activities` once we're off Classic. Just use `item.system.activities` instead.
  static getVisibleActivities(
    item: Item5e,
    activities: Activity5e[],
    forItemSheet: boolean = false,
  ): Activity5e[] {
    // To allow the array to be completely swapped during hook calls, contain within an object.
    const visibleActivities = {
      activities: activities.filter(
        (activity: Activity5e) =>
          !item.getFlag('dnd5e', 'riders.activity')?.includes(activity.id) &&
          Activities.isActivityVisible(activity),
      ),
    };

    if (!forItemSheet) {
      TidyHooks.tidy5eSheetsGetActivitiesForPlay(item, visibleActivities);
    }

    return visibleActivities.activities;
  }

  /** Activities to display on the item sheet, depending on edit vs view mode. */
  static getItemSheetActivities(
    item: Item5e,
    unlocked: boolean,
  ): Activity5e[] {
    if (unlocked) {
      return (item.system.activities ?? []).filter(
        (activity: Activity5e) => Activities.isConfigurable(activity),
      );
    }

    return Activities.getVisibleActivities(
      item,
      Array.from(item.system.activities ?? []),
      true,
    );
  }

  static activationMap: Record<string, string> = {
    action: 'DND5E.ActionAbbr',
    bonus: 'DND5E.BonusActionAbbr',
    reaction: 'DND5E.ReactionAbbr',
    minute: 'DND5E.TimeMinuteAbbr',
    hour: 'DND5E.TimeHourAbbr',
    day: 'DND5E.TimeDayAbbr',
  };

  static getActivityItemContext(
    sheet: any,
    activity: Activity5e,
    unlocked: boolean,
    editable: boolean,
  ): ActivityItemContext {
    // To Hit
    const toHit = parseInt(activity.labels.modifier);

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
      hasLimitedUses: !!activity.uses?.max,
      isOnCooldown,
      activation: activationAbbr
        ? `${activity.activation.value ?? ''}${game.i18n.localize(
            activationAbbr,
          )}`
        : activity.labels.activation,
      spell: activity.spell
        ? {
            uuid: activity.spell.uuid,
          }
        : undefined,
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
      type: activity.type,
      rowActions: ActivityRowActionRuntime.getRowActions({
        app: sheet,
        data: {
          owner: sheet.document.isOwner,
          unlocked,
          editable: editable,
        },
        rowDocument: activity,
        sheetDocument: sheet.document,
      }),
    };
  }

  static getLinkedUses(item: Item5e): LinkedUses | undefined {
    const linkedActivity = item.system.linkedActivity;

    if (linkedActivity) {
      return linkedActivity.consumption?.targets.find(
        (t: any) => t.type === 'activityUses',
      )
        ? {
            ...linkedActivity.uses,
            valueProp: 'uses.value',
            spentProp: 'uses.spent',
            maxProp: 'uses.max',
            doc: linkedActivity,
          }
        : linkedActivity.consumption?.targets.find(
              (t: any) => t.type === 'itemUses',
            )
          ? {
              ...linkedActivity.item.system.uses,
              valueProp: 'system.uses.value',
              spentProp: 'system.uses.spent',
              maxProp: 'system.uses.max',
              doc: linkedActivity.item,
            }
          : undefined;
    }
  }
}
