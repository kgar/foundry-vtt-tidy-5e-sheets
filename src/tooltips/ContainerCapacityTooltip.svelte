<script lang="ts">
  import { systemSettings } from 'src/settings/settings.svelte';
  import { Tooltip } from './Tooltip';
  import { getThemeV2 } from 'src/theme/theme';
  import CapacityTracker from 'src/sheets/quadrone/container/parts/CapacityTracker.svelte';
  import type { Item5e } from 'src/types/item.types';
  import type { ContainerCapacityContext } from 'src/types/types';
    import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    container: Item5e;
    capacity: ContainerCapacityContext;
    showIcon?: boolean;
  }

  const { container, capacity, showIcon }: Props = $props();

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
      getThemeV2(container),
    );
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="hidden">
  <div bind:this={tooltip} class="container-capacity-tooltip">
    <h3 class="font-title-medium color-text-default">
      {localize('DND5E.CONTAINER.FIELDS.capacity.label')}
    </h3>
    <hr />
    <CapacityTracker {container} {capacity} {showIcon} />
  </div>
</div>
