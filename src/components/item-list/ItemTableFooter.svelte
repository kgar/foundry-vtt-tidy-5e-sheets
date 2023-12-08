<script lang="ts">
  import type { Actor5e } from 'src/types/types';
  import ItemCreateButton from '../item-list/ItemCreateButton.svelte';

  export let dataset: Record<string, unknown>;
  export let actor: Actor5e;
  export let canCreate = true;
  /**
   * Override for the underlying create button's `create()` function.
   */
  export let create: (() => void) | undefined = undefined;
</script>

<footer class="item-table-footer-row">
  {#if canCreate}
    <ItemCreateButton {dataset} {actor} {create} />
  {/if}
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
