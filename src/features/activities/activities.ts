import type { Activity5e } from 'src/foundry/dnd5e.types';

export class Activities {
  static isConfigurable(activity: Activity5e) {
    return CONFIG.DND5E.activityTypes[activity.type]?.configurable !== false;
  }
}
