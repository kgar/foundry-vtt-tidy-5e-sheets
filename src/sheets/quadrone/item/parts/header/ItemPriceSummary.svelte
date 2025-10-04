<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Item5e } from 'src/types/item.types';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    item: Item5e;
    icon?: boolean;
    truncate?: boolean;
    showTitle?: boolean;
  } & HTMLAttributes<HTMLElement>;

  let {
    item,
    icon = true,
    truncate = false,
    class: cssClass,
    showTitle = false,
    ...rest
  }: Props = $props();

  let denomination = $derived(
    CONFIG.DND5E.currencies[item.system.price.denomination],
  );

  let itemValueText = $derived(
    FoundryAdapter.formatNumber(item.system.price?.value),
  );

  let title = $derived(
    showTitle
      ? `${itemValueText} ${denomination?.abbreviation?.toLocaleUpperCase()}`
      : '',
  );

  let context = $derived(getSheetContext());

  let gmEditMode = $derived(FoundryAdapter.isInGmEditMode(context.document));

  let conceal = $derived(item.system.identified === false && !gmEditMode);
</script>

<div data-tooltip={title} class="item-price {cssClass}" {...rest}>
  <!-- Currency Image -->
  {#if icon}
    <i
      class="currency {item.system?.price?.denomination ?? ''}"
      aria-label={denomination?.label ?? ''}
    ></i>
  {/if}
  <span class="item-price-number" class:truncate>
    <!-- Value Text -->
    <span class="color-text-default text-data">
      {#if !conceal || gmEditMode}
        {itemValueText}
      {:else}
        ?
      {/if}
    </span>
    <!-- Denom -->
    <span class="item-price-denomination color-text-lighter">
      {denomination?.abbreviation ?? ''}
    </span>
  </span>
</div>
