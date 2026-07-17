<script lang="ts" generics="TData extends {}">
  import type { TidyTableAction } from 'src/types/types';

  type Props = {
    rowActions?: TidyTableAction<any, TData>[];
    data: TData;
  };

  let { rowActions = [], data }: Props = $props();
</script>

{#each rowActions as action}
  {const props = $derived(action.props({ data }))}
  <action.component {...props} />
{/each}
