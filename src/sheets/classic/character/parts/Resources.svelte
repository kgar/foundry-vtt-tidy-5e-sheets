<script lang="ts">
  import Resource from './Resource.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = getCharacterSheetContext();
</script>

<ul
  class="resources"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.RESOURCES_CONTAINER}
>
  {#each context.tidyResources as resource}
    <Resource {resource} />
  {/each}
</ul>

<style lang="scss">
  .resources {
    border: 0.0625rem solid var(--t5e-faint-color);
    border-radius: 0.3125rem;
    display: flex;
    flex-wrap: wrap;
  }
</style>
