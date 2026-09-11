<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Item5e, ItemSheetQuadroneContext } from 'src/types/item.types';
  import type {
    ActiveEffect5e,
    ActorSheetQuadroneContext,
    EffectCategory,
  } from 'src/types/types';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import EffectPillSwitch from './EffectPillSwitch.svelte';

  interface Props {
    item?: Item5e | null;
  }

  let { item = null }: Props = $props();

  const localize = FoundryAdapter.localize;

  function getEffectNotes(
    category: EffectCategory<ActiveEffect5e>,
    effect: ActiveEffect5e,
    riderParentNames: Record<string, string[]>,
  ): string[] {
    const notes: string[] = [];

    // Category info, like why suppressed effects are inactive
    notes.push(...(category.info ?? []));

    const parentNames = riderParentNames[effect.id];

    if (parentNames?.length) {
      notes.push(
        `${localize('DND5E.EFFECT.RIDER.Effect')}, ${parentNames.join(', ')}`,
      );
    }

    return notes;
  }

  let context =
    $derived(
      getSheetContext<ActorSheetQuadroneContext | ItemSheetQuadroneContext>(),
    );

  let identified = $derived(item?.identified !== false);

  /**
   * The Effects tab splits effects across several sections. Inline, they are a
   * flat list with a category label for each entry
   */
  let effectEntries = $derived.by(() => {
    const editable = context.editable;

    if (!item) {
      return [];
    }

    const categories: Record<string, EffectCategory<ActiveEffect5e>> =
      dnd5e.applications.components.EffectsElement.prepareCategories(
        item.effects,
        { parent: item },
      );

    const riderParentNames = ActiveEffectsHelper.getRiderEffectParentNames(item);

    return Object.values(categories)
      .filter((category) => !category.isEnchantment && category.type !== 'passive')
      .flatMap((category) =>
        category.effects.map((effect) => ({
          effect,
          categoryLabel: ActiveEffectsHelper.getEffectCategoryTypeLabel(category),
          enabled: !effect.disabled,
          // Unavailable effects are marked disabled at the category level
          toggleDisabled: !editable || !effect.isOwner || !!category.disabled,
          notes: getEffectNotes(category, effect, riderParentNames),
        })),
      );
  });
</script>

{#if identified && effectEntries.length}
  <div class="pills inline-effects-list" data-item-id={item?.id}>
    {#each effectEntries as entry (entry.effect.id)}
      <EffectPillSwitch
        effect={entry.effect}
        categoryLabel={entry.categoryLabel}
        enabled={entry.enabled}
        disabled={entry.toggleDisabled}
        notes={entry.notes}
      />
    {/each}
  </div>
{/if}
