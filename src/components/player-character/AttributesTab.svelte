<script lang="ts">
  import type { ActorSheetContext, SheetFunctions } from 'src/types/types';
  import ListContainer from '../layout/ListContainer.svelte';
  import SkillsList from '../attributes/skills-list.svelte';
  import Traits from '../attributes/traits.svelte';
  import Favorites from '../attributes/Favorites.svelte';
  import Resources from '../attributes/resources.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';

  export let context: ActorSheetContext;
  export let sheetFunctions: SheetFunctions;

  const allowEdit = FoundryAdapter.tryGetFlag<boolean>(
    context.actor,
    'allow-edit'
  );
  const showResources =
    allowEdit ||
    context.resources.some(
      (x) => x.value !== null || x.label !== '' || x.max !== null
    );

  const traitsMovedBelowResource =
    SettingsProvider.settings.traitsMovedBelowResource.get();
</script>

<ListContainer cssClass="attributes-tab-contents">
  <section class="side-panel">
    <SkillsList {context} />
    {#if !traitsMovedBelowResource}
      <Traits {context} />
    {/if}
  </section>
  <section class="main-panel">
    {#if showResources}
      <Resources {context} />
    {/if}
    {#if traitsMovedBelowResource}
      <Traits {context} />
    {/if}
    <Favorites {context} />
  </section>
</ListContainer>

<style lang="scss">
  :global(.attributes-tab-contents) {
    display: flex;
    flex-direction: row;
    gap: 1rem;
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
    gap: 0.5rem;
    flex: 1;
    overflow-y: initial;
    padding: 0;
    margin-left: 1rem;
    height: auto;
    overflow-x: auto;
  }
</style>
