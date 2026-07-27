<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Item5e, ItemSheetQuadroneContext } from 'src/types/item.types';
  import type {
    ActiveEffect5e,
    ActorSheetQuadroneContext,
    EffectCategory,
  } from 'src/types/types';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import EffectPillSwitch from './EffectPillSwitch.svelte';

  interface Props {
    item?: Item5e | null;
  }

  let { item = null }: Props = $props();

  let context =
    $derived(
      getSheetContext<ActorSheetQuadroneContext | ItemSheetQuadroneContext>(),
    );

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

    return Object.values(categories)
      .filter((category) => !category.isEnchantment)
      .flatMap((category) =>
        category.effects.map((effect) => ({
          effect,
          categoryLabel: ActiveEffectsHelper.getEffectCategoryTypeLabel(category),
          enabled: !effect.disabled,
          toggleDisabled: !editable || !effect.isOwner,
        })),
      );
  });
</script>

{#if effectEntries.length}
  <div class="pills inline-effects-list" data-item-id={item?.id}>
    {#each effectEntries as entry (entry.effect.id)}
      <EffectPillSwitch
        effect={entry.effect}
        categoryLabel={entry.categoryLabel}
        enabled={entry.enabled}
        disabled={entry.toggleDisabled}
        // data-effect-id={entry.effect.id} data-parent-id={item?.id}
      />
    {/each}
  </div>
{/if}
