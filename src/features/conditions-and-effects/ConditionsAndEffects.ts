import type { ConditionType } from 'src/foundry/config.types';
import type { Dnd5eActorCondition } from 'src/foundry/foundry-and-system';
import type {
  ActiveEffect5e,
  ActiveEffectContext,
  ActiveEffectSection,
  Actor5e,
  DocumentSheetQuadroneContext,
  EffectCategory,
} from 'src/types/types';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';

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
    const conditions = Object.entries<ConditionType>(
      CONFIG.DND5E.conditionTypes
    ).reduce<Dnd5eActorCondition[]>((arr, [k, c]) => {
      if (c.pseudo) return arr; // Filter out pseudo-conditions.
      const { name, img, reference } = c;
      const id = dnd5e.utils.staticID(`dnd5e${k}`);
      conditionIds.add(id);
      const existing = actor.effects.get(id);
      const { disabled, img: existingImg } = existing ?? {};
      arr.push({
        name,
        reference,
        id: k,
        icon: existingImg ?? img,
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

  static async getConditionsAndEffectsForActorQuadrone(
    context: DocumentSheetQuadroneContext<any>,
    object: any,
    effectSections: Record<string, EffectCategory<ActiveEffect5e>>
  ): Promise<{
    conditions: Dnd5eActorCondition[];
    effects: ActiveEffectSection[];
  }> {
    const conditionIds = new Set();
    const conditions = Object.entries<ConditionType>(
      CONFIG.DND5E.conditionTypes
    ).reduce<Dnd5eActorCondition[]>((arr, [k, c]) => {
      if (c.pseudo) return arr; // Filter out pseudo-conditions.
      const { name, img, reference } = c;
      const id = dnd5e.utils.staticID(`dnd5e${k}`);
      conditionIds.add(id);
      const existing = context.document.effects.get(id);
      const { disabled, img: existingImg } = existing ?? {};
      arr.push({
        name,
        reference,
        id: k,
        icon: existingImg ?? img,
        disabled: existing ? disabled : true,
      });
      return arr;
    }, []);

    let newCategories: ActiveEffectSection[] = [];
    for (const [key, category] of Object.entries(effectSections)) {
      newCategories.push({
        ...category,
        effects: await category.effects.reduce(
          async (arr: ActiveEffectContext[], effect: any) => {
            effect.updateDuration();
            if (conditionIds.has(effect.id) && !effect.duration.remaining) {
              return arr;
            }

            const { id, name, img, disabled, duration } = effect;

            let source = (await effect.getSource()) ?? context.document;

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
              parentId:
                effect.target === effect.parent ? null : effect.parent.id,
              durationParts: duration.remaining
                ? duration.label.split(', ')
                : [],
              hasTooltip: source instanceof dnd5e.documents.Item5e,
              uuid: effect.uuid,
              effect: effect,
            });
            return arr;
          },
          []
        ),
        key: key,
        canCreate: context.editable && !category.isEnchantment,
        dataset: {}, // TODO: put things that help with effect creation via _addDocument here
        show: !category.hidden,
        rowActions: TableRowActionsRuntime.getEffectsRowActions(context),
      });
    }

    return {
      conditions,
      effects: newCategories,
    };
  }

  static async getEffectsForItem(
    context: DocumentSheetQuadroneContext<any>,
    effectSections: Record<string, EffectCategory<ActiveEffect5e>>
  ): Promise<ActiveEffectSection[]> {
    let newCategories: ActiveEffectSection[] = [];

    for (const [key, category] of Object.entries(effectSections)) {
      newCategories.push({
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
        key: key,
        canCreate: context.editable && !category.isEnchantment,
        dataset: {}, // TODO: put things that help with effect creation via _addDocument here
        show: !category.hidden,
        rowActions: TableRowActionsRuntime.getEffectsRowActions(context),
      });
    }

    return newCategories;
  }
}
