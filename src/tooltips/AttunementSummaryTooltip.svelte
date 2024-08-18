<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';

  export let attunedItems: Item5e[] = [];

  let tooltip: HTMLElement;

  export function getMarkup() {
    return tooltip.outerHTML;
  }

  const localize = FoundryAdapter.localize;
</script>

<div bind:this={tooltip} class="attunement-summary-tooltip">
  <h3>{localize('TIDY5E.AttunementItems')}</h3>
  <hr />
  <ul>
    {#each attunedItems as item}
      <li class="flex-row extra-small-gap align-items-center">
        <div class="image" style="background-image: url('{item.img}')"></div>
        <span>{item.name}</span>
      </li>
    {/each}
  </ul>
</div>
