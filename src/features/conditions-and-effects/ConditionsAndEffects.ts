import type { Dnd5eActorCondition } from 'src/foundry/foundry-and-system';
import type {
  ActiveEffect5e,
  ActiveEffectContext,
  Actor5e,
  EffectCategory,
} from 'src/types/types';

// TODO: In AppV2, consider a mixin for common data preparation between Actors, like in dnd5e.
export class ConditionsAndEffects {
  static async getConditionsAndEffectsForActor(
    actor: Actor5e,
    object: any,
    effectSections: Record<string, EffectCategory<ActiveEffect5e>>
  ): Promise<{
    conditions: Dnd5eActorCondition[];
    effects: Record<string, EffectCategory<ActiveEffectContext>>;
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
        async (arr: ActiveEffectContext[], effect: any) => {
          effect.updateDuration();
          if (conditionIds.has(effect.id) && !effect.duration.remaining) {
            return arr;
          }

          const { id, name, img, disabled, duration } = effect;

          let source = (await effect.getSource()) ?? actor;

          // If the source is an ActiveEffect from another Actor, note the source as that Actor instead.
          if (source instanceof ActiveEffect) {
            source = source.target;
            if (
              source instanceof Item &&
              source.parent &&
              source.parent !== object
            ) {
              source = source.parent;
            }
          }

          arr = await arr;
          arr.push({
            id,
            name,
            img,
            disabled,
            duration,
            source,
            parent,
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

  static async getEffectsForItem(
    effectSections: Record<string, EffectCategory<ActiveEffect5e>>
  ): Promise<Record<string, EffectCategory<ActiveEffectContext>>> {
    let newCategories: Record<string, EffectCategory<ActiveEffectContext>> = {};

    for (const [key, category] of Object.entries<any>(effectSections)) {
      newCategories[key] = {
        ...category,
        effects: await category.effects.reduce(
          async (arr: ActiveEffectContext[], effect: ActiveEffect5e) => {
            effect.updateDuration();
            const { id, name, img, disabled, duration } = effect;
            const source = await effect.getSource();
            arr = await arr;
            arr.push({
              id,
              name,
              img,
              disabled,
              duration,
              source,
              parent,
              parentId:
                effect.target === effect.parent ? null : effect.parent.id,
              durationParts: duration.remaining
                ? duration.label.split(', ')
                : [],
              hasTooltip: true,
              uuid: effect.uuid,
              effect: effect,
            });
            return arr;
          },
          []
        ),
      };
    }

    return newCategories;
  }
}
