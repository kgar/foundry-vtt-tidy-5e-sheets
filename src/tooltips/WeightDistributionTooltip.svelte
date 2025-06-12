<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { systemSettings } from 'src/settings/settings.svelte';
  import { Tooltip } from './Tooltip';
  import { getThemeV2 } from 'src/theme/theme';

  interface Props {
    sheetDocument: any;
    fullWeight: number;
    currencyWeight: number;
  }

  let { sheetDocument, fullWeight, currencyWeight }: Props = $props();

  let itemsWeight = $derived(fullWeight - currencyWeight);

  let tooltip: HTMLElement;

  export function tryShow(
    event: Event & { currentTarget: EventTarget & HTMLElement },
  ): any {
    if (!systemSettings.value.currencyWeight) {
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
</div>
