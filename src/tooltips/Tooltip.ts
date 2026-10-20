import type { Activity5e } from 'src/foundry/dnd5e.types';
import type { Item5e } from 'src/types/item.types';
import type { ActiveEffect5e } from 'src/types/types';

export class Tooltip {
  static show(target: HTMLElement, markup: string, theme: string) {
    game.tooltip.activate(target, {
      html: markup,
      cssClass: `tidy5e-sheet application quadrone tooltip themed theme-${theme}`,
    });
  }

  static hide() {
    game.tooltip.deactivate();
  }

  static getItemReference(item: Item5e): string {
    return item.uuid;
  }

  static getEffectReference(effect: ActiveEffect5e): string {
    return effect.uuid;
  }

  static getActivityReference(activity: Activity5e): string {
    return activity.uuid;
  }

  static getSkillReference(id: string): string | undefined {
    return CONFIG.DND5E.skills[id]?.reference;
  }

  static getToolReference(id: string): string | undefined {
    return dnd5e.documents.Trait.getBaseItemUUID(
      CONFIG.DND5E.tools[id]?.id ?? '',
    );
  }
}
