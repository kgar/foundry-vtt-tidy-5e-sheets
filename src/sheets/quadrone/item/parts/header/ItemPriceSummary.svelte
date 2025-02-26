<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
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
</script>

<div {title} class="item-price font-weight-label {cssClass}" {...rest}>
  <!-- Currency Image -->
  {#if icon}
    <i
      class="currency {item.system?.price?.denomination ?? ''}"
      aria-label={denomination?.label ?? ''}
    ></i>
  {/if}
  <span class="item-price-number" class:truncate>
    <!-- Value Text -->
    <span class="color-text-default">
      {itemValueText}
    </span>
    <!-- Denom -->
    <span class="item-price-denomination color-text-lighter">
      {denomination?.abbreviation ?? ''}
    </span>
  </span>
</div>
