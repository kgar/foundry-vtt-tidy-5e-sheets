<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { CrewMemberContext } from 'src/types/types';

  let { rowDocument, rowContext }: ColumnCellProps<any, CrewMemberContext> =
    $props();

  const context = $derived(getVehicleSheetQuadroneContext());
  const localize = FoundryAdapter.localize;

  let uuid = $state('');

  const mountableItems = $derived(Object.values(context.mountableItems));

  async function handleChange(
    event: Event & { currentTarget: EventTarget & HTMLSelectElement },
  ) {
    const src =
      event.currentTarget.closest('[data-area]')?.getAttribute('data-area') ??
      'crew';
    const item = await fromUuid(uuid);
    await context.sheet._assignCrew(rowDocument, item, { src });
    uuid = '';
  }
</script>

{#if mountableItems.length}
  <select
    bind:value={uuid}
    onchange={handleChange}
    class={[{ uninput: !context.unlocked }]}
  >
    <option value="">{localize('CONTROLS.CommonSelect')}</option>
    {#each mountableItems as item}
      <option value={item.uuid}>
        {item.name}
        {item.crew.value}/{item.crew.max ?? '—'}
      </option>
    {/each}
  </select>
{:else}
  <span class="color-text-disabled">—</span>
{/if}
