<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import SpellOpenCastActivityControl from './SpellOpenCastActivityControl.svelte';
  import ItemDeleteControl from './ItemDeleteControl.svelte';

  export let item: Item5e;
</script>

{#if item.canDelete || !item.system.linkedActivity}
  <ItemDeleteControl {item} />
{:else}
  <SpellOpenCastActivityControl {item} />
{/if}
