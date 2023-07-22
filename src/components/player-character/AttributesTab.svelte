<script lang="ts">
  import type { ActorSheetContext, SheetFunctions } from 'src/types/types';
  import ListContainer from '../layout/ListContainer.svelte';
  import SkillsList from '../attributes/skills-list.svelte';
  import Traits from '../attributes/traits.svelte';

  export let context: ActorSheetContext;
  export let sheetFunctions: SheetFunctions;
</script>

<ListContainer cssClass="attributes-tab-contents">
  <section class="side-panel">
    <SkillsList {context} />
    <Traits {context} />
  </section>
  <section class="main-panel">Main panel</section>
</ListContainer>

<style lang="scss">
  :global(.attributes-tab-contents) {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .side-panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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
