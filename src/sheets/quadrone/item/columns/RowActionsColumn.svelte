<script
  lang="ts"
  generics="TPropsData extends {}, TAction extends TableRowAction<any, TPropsData, any>"
>
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { TableRowAction } from 'src/types/row-actions.types';

  type Props = {
    rowActions: TAction[];
    data: TPropsData;
    columnWidth: string;
  };

  let { rowActions, columnWidth, data }: Props = $props();
</script>

<TidyTableCell
  {columnWidth}
  class="tidy-table-actions"
  attributes={{
    ['data-tidy-column-key']: CONSTANTS.COLUMN_KEY_ROW_ACTIONS,
  }}
>
  {#each rowActions as action}
    {const props = $derived(action.props(data))}
    <action.component {...props} />
  {/each}
</TidyTableCell>
