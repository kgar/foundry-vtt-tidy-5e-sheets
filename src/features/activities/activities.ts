import { TidyHooks } from 'src/api';
import type { Activity5e } from 'src/foundry/dnd5e.types';
import type { Item5e } from 'src/types/item.types';

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
}
