<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import { Tooltip } from './Tooltip';
  import { getThemeV2 } from 'src/theme/theme';

  interface Props {
    sheetDocument: any;
    attunedItems?: Item5e[];
  }

  let { sheetDocument, attunedItems = [] }: Props = $props();

  let tooltip: HTMLElement;

  export function tryShow(
    event: Event & { currentTarget: EventTarget & HTMLElement },
  ): any {
    if (!attunedItems.length) {
      return;
    }

    Tooltip.show(
      event?.currentTarget,
      tooltip.outerHTML,
      getThemeV2(sheetDocument),
    );
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="hidden">
  <div bind:this={tooltip} class="document-list-summary-tooltip">
    <h3 class="font-title-medium color-text-default">
      {localize('TIDY5E.AttunementItems')}
    </h3>
    <hr />
    <ul>
      {#each attunedItems as item}
        <li class="image-and-name">
          <img class="item-image" src={item.img} />
          <div class="item-name truncate">{item.name}</div>
        </li>
      {/each}
    </ul>
  </div>
</div>
