<script lang="ts">
  import VerticalLineSeparator from 'src/components/layout/VerticalLineSeparator.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemDescription from './ItemDescriptionTab.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  let movementLabels = $derived(
    Object.values(context.item.system.movementLabels) as string[],
  );

  let sensesLabels = $derived(context.item.system.sensesLabels);

  const localize = FoundryAdapter.localize;
</script>

<div class="item-description flexrow align-items-stretch small-gap">
  <div
    class="item-properties"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_SHEET_PROPERTIES}
  >
    <h4 class="properties-header flex-row justify-content-space-between">
      {localize('DND5E.Type')}
      {#if context.editable}
        <button
          class="inline-icon-button hidden-config-button"
          type="button"
          onclick={() => FoundryAdapter.renderCreatureTypeConfig(context.item)}
          tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fas fa-cog"></i>
        </button>
      {/if}
    </h4>
    <ol class="properties-list">
      <li>{context.item.system.typeLabel}</li>
    </ol>
    <h4 class="properties-header flex-row justify-content-space-between">
      {localize('DND5E.Movement')}
      {#if context.editable}
        <button
          type="button"
          class="inline-icon-button hidden-config-button"
          data-action="movement"
          onclick={() =>
            FoundryAdapter.renderMovementSensesConfig(context.item, 'movement')}
          tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fas fa-cog"></i>
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
      {#if context.editable}
        <button
          type="button"
          class="inline-icon-button hidden-config-button"
          data-action="senses"
          onclick={() =>
            FoundryAdapter.renderMovementSensesConfig(context.item, 'senses')}
          tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fas fa-cog"></i>
        </button>
      {/if}
    </h4>
    <ol class="properties-list">
      {#each sensesLabels as label}
        <li>{label}</li>
      {:else}
        <li>{localize('DND5E.None')}</li>
      {/each}
    </ol>
  </div>

  <VerticalLineSeparator />

  <ItemDescription />
</div>

<style lang="less">
  .item-properties {
    flex: 0 0 7.5rem;
  }
</style>
