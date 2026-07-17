<script
  lang="ts"
  generics="TData extends {}, TAction extends TidyTableAction<any, TData>"
>
  import type { TidyTableAction } from 'src/types/types';

  type Props = {
    rowActions?: TAction[];
    data: TData;
  };

  let { rowActions = [], data }: Props = $props();
</script>

{#each rowActions as action}
  {const props = $derived(action.props({ data }))}
  <action.component {...props} />
{/each}
