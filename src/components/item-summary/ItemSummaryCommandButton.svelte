<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { RegisteredItemSummaryCommand } from 'src/runtime/types';
  import { settingStore } from 'src/settings/settings';
  import type { Item5e } from 'src/types/item';

  export let command: RegisteredItemSummaryCommand;
  export let item: Item5e;
</script>

<button
  type="button"
  class="item-summary-command"
  title={command.tooltip ?? null}
  on:click={() => command.execute?.({ item: item })}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
>
  {#if command.iconClass}
    <i class={command.iconClass}></i>
  {/if}
  {FoundryAdapter.localize(command.label ?? '')}
</button>

<style lang="scss">
  .item-summary-command {
    width: auto;
    line-height: 1rem;
    padding: 0.125rem 0.25rem;
    border-radius: 0.3125rem;
    background: var(--t5ek-content-entity-link-background);
    color: var(--t5ek-content-entity-link-color);
    border: 0.0625rem solid var(--t5ek-separator-color);
    font-size: 0.75rem;
    margin: 0;

    display: inline-flex;
    align-items: center;
    gap: 0.25rem;

    i {
      color: var(--t5ek-content-entity-link-color);
    }

    &:hover {
      color: var(--t5ek-content-entity-link-hover-color);
      background: var(--t5ek-content-entity-link-hover-background);

      i {
        color: var(--t5ek-content-entity-link-hover-color);
      }
    }
  }
</style>
