<script lang="ts">
  import type { Item5e } from 'src/types/item.types';

  export let attunedItems: Item5e[] = [];

  let tooltip: HTMLElement;

  export function getMarkup() {
    return tooltip.outerHTML;
  }
</script>

<div bind:this={tooltip} class="attunement-summary-tooltip">
  <h3>Attuned Items</h3>
  <hr />
  <ul>
    {#each attunedItems as item}
      <li class="flex-row extra-small-gap align-items-center">
        <div class="image" style="background-image: url('{item.img}')">
          <!-- For max-content widths, some kind of content is required within this background-image div. Otherwise, the layout breaks. -->
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <span>{item.name}</span>
      </li>
    {/each}
  </ul>
</div>
