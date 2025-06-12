<script lang="ts">
  import type { Actor5e } from 'src/types/types';
  import { tick } from 'svelte';
  import { Tooltip } from './Tooltip';
  import { getThemeV2 } from 'src/theme/theme';

  interface Props {
    sheetDocument: any;
  }

  let { sheetDocument }: Props = $props();

  let tooltip: HTMLElement;

  let occupants = $state<Actor5e[]>([]);
  let title = $state('');

  export async function tryShow(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
    uuids: string[],
    tooltipTitle: string,
  ) {
    if (!uuids.length) {
      return;
    }

    const bastionOccupants: Actor5e[] = [];
    for (const uuid of uuids) {
      bastionOccupants.push(await fromUuid(uuid));
    }

    occupants = bastionOccupants;
    title = tooltipTitle;

    await tick();

    Tooltip.show(
      (event?.target as HTMLElement | null) ?? event.currentTarget,
      tooltip.outerHTML,
      getThemeV2(sheetDocument),
    );
  }
</script>

<div class="hidden">
  <div bind:this={tooltip} class="document-list-summary-tooltip">
    <h3>{title}</h3>
    <hr />
    <ul>
      {#each occupants as occupant}
        <li class="image-and-name">
          <div
            class="item-image"
            style="background-image: url('{occupant.img}')"
          ></div>
          <div class="item-name truncate">{occupant.name}</div>
        </li>
      {/each}
    </ul>
  </div>
</div>
