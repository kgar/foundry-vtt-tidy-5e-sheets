<script lang="ts">
  import type { CharacterSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Resource from './Resource.svelte';

  let context = getContext<Readable<CharacterSheetContext>>('context');
</script>

<ul class="resources">
  {#each $context.tidyResources as resource}
    <Resource {resource} />
  {/each}
</ul>

<style lang="scss">
  .resources {
    border: 0.0625rem solid var(--t5ek-faint-color);
    border-radius: 0.3125rem;
    display: flex;
    flex-wrap: wrap;
  }
</style>
