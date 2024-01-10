<script lang="ts">
  import type { Actor5e } from 'src/types/types';
  import ItemCreateButton from '../item-list/ItemCreateButton.svelte';
  import { ActorItemRuntime } from 'src/runtime/ActorItemRuntime';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let section: any;
  export let actor: Actor5e;
  export let canCreate = true;
  /**
   * Override for the underlying create button's `create()` function.
   */
  export let create: (() => void) | undefined = undefined;
  export let isItem: boolean;

  let customCommands = isItem
    ? ActorItemRuntime.getActorItemSectionCommands({ actor, section })
    : [];

  const localize = FoundryAdapter.localize;
</script>

<footer class="item-table-footer-row">
  {#if canCreate}
    <ItemCreateButton dataset={section.dataset} {actor} {create} />
  {/if}
  {#each customCommands as command}
    <button
      type="button"
      class="item-list-footer-button"
      on:click={(ev) => command.execute?.({ section, event: ev, actor: actor })}
      title={localize(command.tooltip ?? '')}
      on:keydown={(ev) => FoundryAdapter.forceKeyboardManagerEvent(false, ev)}
      on:keyup={(ev) => FoundryAdapter.forceKeyboardManagerEvent(true, ev)}
    >
      {#if (command.iconClass ?? '') !== ''}
        <i class={command.iconClass} />
      {/if}
      {localize(command.label ?? '')}
    </button>
  {/each}
</footer>

<style lang="scss">
  .item-table-footer-row {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    margin-left: 0.5rem;
    border-radius: 0 0 0.3125rem 0.3125rem;
  }
</style>
