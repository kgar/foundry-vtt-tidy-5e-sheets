import type { Activity5e } from 'src/foundry/dnd5e.types';
import type { Item5e } from 'src/types/item.types';

export class Activities {
  static isConfigurable(activity: Activity5e) {
    return CONFIG.DND5E.activityTypes[activity.type]?.configurable !== false;
  }

  static getVisibleActivities(item: Item5e, activities: Activity5e[]) {
    return activities?.filter(
      (a: Activity5e) =>
        !item.getFlag('dnd5e', 'riders.activity')?.includes(a.id)
    );
  }
}
