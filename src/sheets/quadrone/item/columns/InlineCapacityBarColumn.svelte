<script lang="ts">
  import CapacityBar from 'src/sheets/quadrone/container/parts/CapacityBar.svelte';
  import type { ContainerContents, Item5e } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { Container } from 'src/features/containers/Container';
  import { tryGetSheetContext } from 'src/sheets/sheet-context.svelte';

  type Props = {
    container: Item5e;
    containerContents?: ContainerContents;
  };

  let { container, containerContents }: Props = $props();
  const localize = FoundryAdapter.localize;
  
  // Get context so that we can check the sheet and see if container content should be shown.
  const sheetContext = $derived(tryGetSheetContext<{ unlocked?: boolean }>());
  const contentsVisibility = $derived(
    Container.getContentsVisibility(container, {
      unlocked: sheetContext?.unlocked === true,
    }),
  );
</script>

<div class="inline-container-capacity-bar flexrow">
  {#if contentsVisibility === 'visible'}
    {#if containerContents}
      <!-- CapacityBar gates itself and carries its own secret marker. -->
      <CapacityBar
        {container}
        capacity={containerContents.capacity}
        showTracker={false}
      />
    {/if}
  {:else}
    <div class="label">
      <span class="value color-text-lightest">{localize('TIDY5E.Table.UnidentifiedPlaceholder')}</span>
    </div>
  {/if}
</div>
