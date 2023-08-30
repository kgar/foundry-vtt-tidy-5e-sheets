<script lang="ts">
  import type { Actor5e } from 'src/types/actor';
  import ItemCreateButton from '../items/ItemCreateButton.svelte';

  export let dataset: Record<string, unknown>;
  export let actor: Actor5e;
  /**
   * Override for the underlying create button's `create()` function.
   */
  export let create: (() => void) | undefined = undefined;
</script>

<footer class="item-table-footer-row">
  <ItemCreateButton {dataset} {actor} {create} />
</footer>

<style lang="scss">
  .item-table-footer-row {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    margin-left: 0.5rem;
    border-top: 0.0625rem solid var(--t5ek-faint-color);
    border-radius: 0 0 0.3125rem 0.3125rem;
  }
</style>
