<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { RegisteredItemSummaryCommand } from 'src/runtime/types';
  import type { Item5e } from 'src/types/item.types';

  export let command: RegisteredItemSummaryCommand;
  export let item: Item5e;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<a
  type="button"
  class="item-summary-command"
  title={command.tooltip ?? null}
  on:click={() => command.execute?.({ item: item })}
>
  {#if command.iconClass}
    <i class={command.iconClass}></i>
  {/if}
  {FoundryAdapter.localize(command.label ?? '')}
</a>

<style lang="scss">
  .item-summary-command {
    width: auto;
    line-height: 1rem;
    padding: 0.125rem 0.25rem;
    border-radius: 0.3125rem;
    background: var(--t5e-content-entity-link-background);
    color: var(--t5e-content-entity-link-color);
    border: 0.0625rem solid var(--t5e-separator-color);
    font-size: 0.75rem;
    margin: 0;

    display: inline-flex;
    align-items: center;
    gap: 0.25rem;

    i {
      color: var(--t5e-content-entity-link-color);
    }

    &:hover {
      color: var(--t5e-content-entity-link-hover-color);
      background: var(--t5e-content-entity-link-hover-background);

      i {
        color: var(--t5e-content-entity-link-hover-color);
      }
    }
  }
</style>
