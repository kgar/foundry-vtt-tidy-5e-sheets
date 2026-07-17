<script
  lang="ts"
  generics="TPropsData extends {}, TAction extends TableRowAction<any, TPropsData, any>"
>
  import type { TableRowAction } from 'src/types/types';

  type Props = {
    rowActions?: TAction[];
    data: TPropsData;
  };

  let { rowActions = [], data }: Props = $props();
</script>

{#each rowActions as action}
  {const props = $derived(action.props(data))}
  <action.component {...props} />
{/each}
