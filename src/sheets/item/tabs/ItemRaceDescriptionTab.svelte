<script lang="ts">
  import VerticalLineSeparator from 'src/components/layout/VerticalLineSeparator.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemDescription from './ItemDescriptionTab.svelte';
  import { settingStore } from 'src/settings/settings';

  let context = getContext<Readable<ItemSheetContext>>('context');

  $: movementLabels = Object.values(
    $context.item.system.movementLabels,
  ) as string[];

  const localize = FoundryAdapter.localize;
</script>

<div class="item-description flexrow align-items-stretch small-gap">
  <div class="item-properties">
    <h4 class="properties-header flex-row justify-content-space-between">
      {localize('DND5E.Type')}
      {#if $context.editable}
        <button
          class="inline-icon-button hidden-config-button"
          type="button"
          on:click={() => FoundryAdapter.renderItemTypeConfig($context.item)}
          tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fas fa-cog" />
        </button>
      {/if}
    </h4>
    <ol class="properties-list">
      <li>{$context.item.system.typeLabel}</li>
    </ol>
    <h4 class="properties-header flex-row justify-content-space-between">
      {localize('DND5E.Movement')}
      {#if $context.editable}
        <button
          type="button"
          class="inline-icon-button hidden-config-button"
          data-action="movement"
          on:click={() =>
            FoundryAdapter.renderItemMovementConfig($context.item)}
          tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fas fa-cog" />
        </button>
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
        <button
          type="button"
          class="inline-icon-button hidden-config-button"
          data-action="senses"
          on:click={() => FoundryAdapter.renderItemSensesConfig($context.item)}
          tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fas fa-cog" />
        </button>
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
