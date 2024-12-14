<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';

  interface Props {
    attunedItems?: Item5e[];
  }

  let { attunedItems = [] }: Props = $props();

  let tooltip: HTMLElement;

  export function getMarkup() {
    return tooltip.outerHTML;
  }

  const localize = FoundryAdapter.localize;
</script>

<div bind:this={tooltip} class="document-list-summary-tooltip">
  <h3>{localize('TIDY5E.AttunementItems')}</h3>
  <hr />
  <ul>
    {#each attunedItems as item}
      <li class="flex-row extra-small-gap align-items-center">
        <img class="item-image" src={item.img} />
        <div class="item-name truncate">{item.name}</div>
      </li>
    {/each}
  </ul>
</div>
