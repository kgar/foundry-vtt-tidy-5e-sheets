<script lang="ts">
  import ItemTable from 'src/components/item-list/v1/ItemTable.svelte';
  import ItemTableColumn from 'src/components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/v1/ItemTableHeaderRow.svelte';
  import ConditionToggle from 'src/components/toggle/ConditionToggle.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CharacterSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<ItemTable key="conditions">
  <svelte:fragment slot="header">
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        {localize('DND5E.Conditions')}
      </ItemTableColumn>
    </ItemTableHeaderRow>
  </svelte:fragment>
  <svelte:fragment slot="body">
    <ul class="conditions-list">
      {#each $context.conditions as condition (condition.id)}
        <li
          class="condition"
          class:active={!condition.disabled}
          data-uuid={condition.reference}
          data-condition-id={condition.id}
        >
          <ConditionToggle {condition} />
        </li>
      {/each}
    </ul>
  </svelte:fragment>
</ItemTable>

<style lang="scss">
  .conditions-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12.5rem, 1fr));
    gap: 0.125rem;
  }
</style>
