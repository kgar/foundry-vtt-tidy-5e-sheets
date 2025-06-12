<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    fullWeight: number;
    currencyWeight: number;
  }

  let { fullWeight: contentsWeight, currencyWeight }: Props = $props();

  let itemsWeight = $derived(contentsWeight - currencyWeight);

  let tooltip: HTMLElement;

  export function getMarkup() {
    return tooltip.outerHTML;
  }

  const localize = FoundryAdapter.localize;
</script>

<div bind:this={tooltip} class="document-list-summary-tooltip">
  <h3 class="font-title-medium color-text-default">
    {localize('DND5E.Weight')}
  </h3>
  <hr />
  <ul class="weight-distribution unlist">
    <li>
      <span class="label">
        <i class="fa-solid fa-sack"></i>
        <span class="truncate">{localize('DND5E.Items')}</span>
      </span>
      <span class="value">{itemsWeight}</span>
    </li>
    <li>
      <span class="label">
        <i class="fa-solid fa-coins"></i>
        <span class="truncate">{localize('DND5E.Currency')}</span>
      </span>
      <span class="value">{currencyWeight}</span>
    </li>
  </ul>
</div>
