import type { Dnd5eActorCondition } from 'src/foundry/foundry-and-system';
import type { Actor5e } from 'src/types/types';

// TODO: In AppV2, consider a mixin for common data preparation between Actors, like in dnd5e.
export class ConditionsAndEffects {
  static async getConditionsAndEffects(
    actor: Actor5e,
    object: any,
    effectSections: any[]
  ): Promise<{
    conditions: Dnd5eActorCondition[];
    effects: any;
  }> {
    const conditionIds = new Set();
    const conditions = Object.entries<any>(CONFIG.DND5E.conditionTypes).reduce<
      Dnd5eActorCondition[]
    >((arr, [k, c]) => {
      if (c.pseudo) return arr; // Filter out pseudo-conditions.
      const { label: name, icon, reference } = c;
      const id = dnd5e.utils.staticID(`dnd5e${k}`);
      conditionIds.add(id);
      const existing = actor.effects.get(id);
      const { disabled, img } = existing ?? {};
      arr.push({
        name,
        reference,
        id: k,
        icon: img ?? icon,
        disabled: existing ? disabled : true,
      });
      return arr;
    }, []);

    for (const category of Object.values(effectSections)) {
      category.effects = await category.effects.reduce(
        async (arr: any[], effect: any) => {
          effect.updateDuration();
          if (conditionIds.has(effect.id) && !effect.duration.remaining)
            return arr;
          const { id, name, img, disabled, duration } = effect;
          let source = (await effect.getSource()) ?? actor;
          // If the source is an ActiveEffect from another Actor, note the source as that Actor instead.
          if (
            source instanceof dnd5e.documents.ActiveEffect5e &&
            source.target !== object
          ) {
            source = source.target;
          }

          arr = await arr;
          arr.push({
            id,
            name,
            img,
            disabled,
            duration,
            source,
            parentId: effect.target === effect.parent ? null : effect.parent.id,
            durationParts: duration.remaining ? duration.label.split(', ') : [],
            hasTooltip: source instanceof dnd5e.documents.Item5e,
            uuid: effect.uuid,
            effect: effect,
          });
          return arr;
        },
        []
      );
    }

    return {
      conditions,
      effects: effectSections,
    };
  }
}
