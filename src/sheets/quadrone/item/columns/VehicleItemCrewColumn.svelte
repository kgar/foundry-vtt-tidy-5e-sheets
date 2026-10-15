<script lang="ts">
  import type { VehicleItemQuadroneContext } from 'src/types/types';
  import type { Item5e } from 'src/types/item.types';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';

  type Props = {
    rowDocument: Item5e;
    rowContext: VehicleItemQuadroneContext;
  };

  let { rowDocument, rowContext }: Props = $props();

  const context = $derived(getVehicleSheetQuadroneContext());
  const localize = FoundryAdapter.localize;

  const value = $derived(
    rowContext.crew?.filter((c) => c.actor && !c.brokenLink).length ?? 0,
  );
  const max = $derived(rowDocument.system.crew?.max);
  const canAddCrew = $derived(
    context.editable && max !== undefined && value < max,
  );
  const addLabel = $derived(
    localize('TIDY5E.COMMON.Action.AddNamed', {
      name: localize('DND5E.VEHICLE.Crew.Label'),
    }),
  );
</script>

{#snippet crewCount()}
  <span class="uses-value font-label-medium color-text-default">
    {value}
  </span>
  <span class="separator">/</span>
  <span class="uses-max font-default-medium color-text-default">{max ?? '—'}</span>
{/snippet}

{#if canAddCrew}
  <!-- svelte-ignore a11y_missing_attribute -->
  <a
    role="button"
    tabindex="0"
    class="inline-crew-count"
    aria-label={addLabel}
    data-tooltip={addLabel}
    onclick={() => context.sheet.browseAssignActor(rowDocument)}
    {@attach InputAttachments.triggerClickOnKeydown}
  >
    {@render crewCount()}
  </a>
{:else if max !== undefined || value > 0}
  <span class={['inline-crew-count', { 'crew-warning': value > max }]}>
    {@render crewCount()}
  </span>
{:else}
  <span class="uses-max font-default-medium color-text-disabled"
    >{max ?? '—'}</span
  >
{/if}
