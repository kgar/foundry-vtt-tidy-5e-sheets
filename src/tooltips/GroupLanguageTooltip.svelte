<script lang="ts">
  import type { Actor5e } from 'src/types/types';

  export let members: Actor5e[];
  export let language: string;

  let tooltip: HTMLElement;

  export function getMarkup() {
    return tooltip.outerHTML;
  }
</script>

<div bind:this={tooltip} class="document-list-summary-tooltip">
  <h3>{language}</h3>
  <hr />
  <ul>
    {#each members as member}
      <li class="flex-row extra-small-gap align-items-center">
        <div
          class="item-image"
          style="background-image: url('{member.img}')"
        ></div>
        <div class="item-name truncate">{member.name}</div>
      </li>
    {/each}
  </ul>
</div>
