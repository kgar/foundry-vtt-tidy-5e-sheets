<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { RegisteredItemSummaryCommand } from 'src/runtime/types';
  import type { Item5e } from 'src/types/item';

  export let command: RegisteredItemSummaryCommand;
  export let item: Item5e;
</script>

<button
  type="button"
  class="item-summary-command"
  on:click={() => command.execute?.({ item: item })}
  >{FoundryAdapter.localize(command.label)}</button
>

<style lang="scss">
  .item-summary-command {
    flex: 0 0 auto;
    width: auto;
    padding: 0;
    margin: 0;
    line-height: normal;
    border-radius: 0.3125rem;
    border: 0.0625rem solid blue;
    background: red;
  }
</style>
