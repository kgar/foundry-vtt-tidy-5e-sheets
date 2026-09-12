<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import type { ContainerCapacityContext } from 'src/types/types';
  import { Container } from 'src/features/containers/Container';
  import { tryGetSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    container: Item5e;
    capacity: ContainerCapacityContext;
    showIcon?: boolean;
    layout?: 'horizontal' | 'vertical';
  }

  let { container, capacity, showIcon = true }: Props = $props();
  const localize = FoundryAdapter.localize;

  // Get context so that we can check the sheet and see if container content should be shown.
  const sheetContext = $derived(tryGetSheetContext<{ unlocked?: boolean }>());
  const contentsVisibility = $derived(
    Container.getContentsVisibility(container, {
      unlocked: sheetContext?.unlocked === true,
    }),
  );

  let value = $derived(
    FoundryAdapter.formatNumber((capacity.value ?? 0).toNearest(0.01)),
  );
  
  let max = $derived(
    capacity.max === Infinity
      ? '∞'
      : FoundryAdapter.formatNumber(capacity.max.toNearest(0.01)),
  );
</script>

{#if contentsVisibility === 'visible'}
<div class="label">
  <span class="row">
    {#if showIcon}
      <i class="fas fa-weight-hanging text-label-icon"></i>
    {/if}
    <span class="value font-weight-label">{value}</span>
    <span class="separator">/</span>
    <span class="max color-text-default">{max}</span>
  </span>
  <span>
    {#if capacity.units}
      <span class="units color-text-lightest">{capacity.units}</span>
    {/if}
  </span>
</div>
{:else}
<div class="label flexrow">
    <span class="value color-text-lightest">{localize('TIDY5E.COMMON.Unidentified.Placeholder')}</span>
</div>
{/if}