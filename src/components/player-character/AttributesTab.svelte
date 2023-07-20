<script lang="ts">
  import type { CharacterSheetContext, SheetFunctions } from 'src/types/types';

  export let context: CharacterSheetContext;
  export let sheetFunctions: SheetFunctions;
</script>

<section class="side-panel">
Side panel
</section>
<section class="main-panel">
Main panel
</section>

<style lang="scss">
  .side-panel {
    display: flex;
    flex-wrap: wrap;
    width: 15rem;
  }

  .main-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: initial;
    padding: 0;
    margin-left: 1rem;
    height: auto;
    overflow-x: inherit;
  }
</style>
