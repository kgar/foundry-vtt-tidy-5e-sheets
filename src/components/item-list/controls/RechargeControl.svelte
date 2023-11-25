<script lang="ts">
  import type { Item5e } from 'src/types/item';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let item: Item5e;

  let context = getContext<Readable<ActorSheetContext>>('context');
</script>

<button
  type="button"
  class="item-list-button"
  title={item.labels.recharge}
  on:click={() => item.rollRecharge()}
  disabled={!$context.owner}
>
  <i class="fas fa-dice-six" />
  {item.system.recharge
    ?.value}{#if item.system.recharge?.value !== 6}+{/if}</button
>
