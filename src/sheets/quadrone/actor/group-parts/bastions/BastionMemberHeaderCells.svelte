<script lang="ts">
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import type { GroupMemberBastionQuadroneContext } from 'src/types/types';
  import BastionOccupantCountColumn from './columns/BastionOccupantCountColumn.svelte';

  interface Props {
    member: GroupMemberBastionQuadroneContext;
    hiddenColumns: Set<string>;
  }

  let { member, hiddenColumns }: Props = $props();
</script>

{#each member.columns.sorted as key}
  {const column = $derived(member.columns.map[key])}
  {const hidden = $derived(hiddenColumns.has(column.key))}

  <TidyTableCell
    columnWidth="{column.widthRems}rem"
    class={{ hidden }}
    attributes={{ ['data-tidy-column-key']: column.key }}
  >
    {#if key === 'hirelings'}
      <BastionOccupantCountColumn occupancy={member.hirelings} />
    {:else if key === 'defenders'}
      <BastionOccupantCountColumn occupancy={member.defenders} />
    {/if}
  </TidyTableCell>
{/each}
