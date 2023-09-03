<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ActorSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  async function toggleLock() {
    await FoundryAdapter.setFlag($store.actor, 'allow-edit', !allowEdit);
  }

  $: allowEdit = FoundryAdapter.tryGetFlag($store.actor, 'allow-edit');
</script>

<div class="toggle-allow-edit">
  <span on:click={() => toggleLock()} class:editing-enabled={allowEdit}>
    {#if allowEdit}
      <i
        class="fas fa-lock-open"
        title="{localize('T5EK.DisableEdit')} - {localize('T5EK.EditHint')}"
      />
    {:else}
      <i
        class="fas fa-lock"
        title="{localize('T5EK.EnableEdit')} - {localize('T5EK.EditHint')}"
      />
    {/if}
  </span>
</div>

<style lang="scss">
  .toggle-allow-edit {
    display: flex;
    // order: 2;
    flex: 0;
    flex-basis: 3rem;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    // padding: 0.125rem 1rem;
    background: var(--t5ek-header-background);
    border: 0.0625rem solid transparent;
    border-bottom: 0.0625rem solid var(--t5ek-header-border-color);
    font-size: 0.8125rem;
    text-align: left;
    height: 1.625rem;

    span {
      cursor: pointer;
      background: var(--t5ek-sheet-unlocked-icon-background);
      color: rgba(255, 255, 255, 0.6);
      border-radius: 0.1875rem;

      &.editing-enabled {
        background: var(--t5ek-sheet-locked-icon-background);
      }

      &:hover {
        color: #fff;
      }

      i {
        width: 100%;
        text-align: center;
        padding: 0.25rem 0.375rem;
      }
    }
  }
</style>
