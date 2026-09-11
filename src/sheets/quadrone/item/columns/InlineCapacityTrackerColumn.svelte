<script lang="ts">
  import type { ContainerContents, Item5e } from 'src/types/item.types';
  import CapacityTracker from '../../container/parts/CapacityTracker.svelte';
  import { Container } from 'src/features/containers/Container';
  import { tryGetSheetContext } from 'src/sheets/sheet-context.svelte';

  type Props = {
    rowDocument: Item5e;
    rowContext: { containerContents?: ContainerContents };
  };

  let { rowDocument, rowContext }: Props = $props();

  // Get context so that we can check the sheet and see if container content should be shown.
  const sheetContext = $derived(tryGetSheetContext<{ unlocked?: boolean }>());
  const contentsVisibility = $derived(
    Container.getContentsVisibility(rowDocument, {
      unlocked: sheetContext?.unlocked === true,
    }),
  );
</script>

<div
  class={[
    'inline-container-capacity-tracker',
    { 'gm-secret': contentsVisibility === 'gmSecret' },
  ]}
>
  {#if rowContext.containerContents}
    <CapacityTracker
      container={rowDocument}
      capacity={rowContext.containerContents.capacity}
      showIcon={false}
    />
  {/if}
</div>
