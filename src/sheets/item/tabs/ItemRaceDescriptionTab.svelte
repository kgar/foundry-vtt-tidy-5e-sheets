<script lang="ts">
  import VerticalLineSeparator from 'src/components/layout/VerticalLineSeparator.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemDescription from './ItemDescriptionTab.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: movementLabels = Object.values(
    $context.item.system.movementLabels,
  ) as string[];

  const localize = FoundryAdapter.localize;
</script>

<div class="item-description flexrow align-items-stretch small-gap">
  <div
    class="item-properties"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_SHEET_PROPERTIES}
  >
    <h4 class="properties-header flex-row justify-content-space-between">
      {localize('DND5E.Type')}
      {#if $context.editable}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          class="inline-icon-button hidden-config-button"
          on:click={() => FoundryAdapter.renderItemTypeConfig($context.item)}
        >
          <i class="fas fa-cog" />
        </a>
      {/if}
    </h4>
    <ol class="properties-list">
      <li>{$context.item.system.typeLabel}</li>
    </ol>
    <h4 class="properties-header flex-row justify-content-space-between">
      {localize('DND5E.Movement')}
      {#if $context.editable}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          class="inline-icon-button hidden-config-button"
          data-action="movement"
          on:click={() =>
            FoundryAdapter.renderItemMovementConfig($context.item)}
        >
          <i class="fas fa-cog" />
        </a>
      {/if}
    </h4>
    <ol class="properties-list">
      {#each movementLabels as label}
        <li>{label}</li>
      {:else}
        <li>{localize('DND5E.None')}</li>
      {/each}
    </ol>
    <h4 class="properties-header flex-row justify-content-space-between">
      {localize('DND5E.Senses')}
      {#if $context.editable}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          class="inline-icon-button hidden-config-button"
          data-action="senses"
          on:click={() => FoundryAdapter.renderItemSensesConfig($context.item)}
        >
          <i class="fas fa-cog" />
        </a>
      {/if}
    </h4>
    <ol class="properties-list">
      {#each $context.item.system.sensesLabels as label}
        <li>{label}</li>
      {:else}
        <li>{localize('DND5E.None')}</li>
      {/each}
    </ol>
  </div>

  <VerticalLineSeparator />

  <ItemDescription />
</div>

<style lang="scss">
  .item-properties {
    flex: 0 0 7.5rem;
  }
</style>
