<script lang="ts">
  import type { Actor5e } from 'src/types/types';

  interface Props {
    occupants?: Actor5e[];
    title?: string;
  }

  let { occupants = [], title = '' }: Props = $props();

  let tooltip: HTMLElement;

  export function getMarkup() {
    return tooltip.outerHTML;
  }
</script>

<div bind:this={tooltip} class="document-list-summary-tooltip">
  <h3>{title}</h3>
  <hr />
  <ul>
    {#each occupants as occupant}
      <li class="flex-row extra-small-gap align-items-center">
        <div
          class="item-image"
          style="background-image: url('{occupant.img}')"
        ></div>
        <div class="item-name truncate">{occupant.name}</div>
      </li>
    {/each}
  </ul>
</div>
