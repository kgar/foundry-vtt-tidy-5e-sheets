<script lang="ts">
  import type { ActorSheetContext, SheetFunctions } from 'src/types/types';
  import SkillsList from '../attributes/SkillsList.svelte';
  import Traits from '../attributes/Traits.svelte';
  import Favorites from '../attributes/Favorites.svelte';
  import Resources from '../attributes/Resources.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import { isNil } from 'src/utils/data';

  export let context: ActorSheetContext;
  export let sheetFunctions: SheetFunctions;

  const allowEdit = FoundryAdapter.tryGetFlag<boolean>(
    context.actor,
    'allow-edit'
  );
  const showResources =
    allowEdit ||
    context.resources.some(
      (x) => !isNil(x.value) || !isNil(x.value, '') || !isNil(x.max)
    );

  const traitsMovedBelowResource =
    SettingsProvider.settings.traitsMovedBelowResource.get();
</script>

<div class="attributes-tab-contents">
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
</div>

<style lang="scss">
  .attributes-tab-contents {
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
    padding: 0;
    margin-left: 1rem;
    height: auto;
    overflow-x: auto;
  }
</style>
