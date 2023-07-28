<script lang="ts">
  import type { ActorSheetContext } from 'src/types/types';
  import SkillsList from '../attributes/SkillsList.svelte';
  import Traits from '../attributes/Traits.svelte';
  import Favorites from '../attributes/Favorites.svelte';
  import Resources from '../attributes/Resources.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import { isNil } from 'src/utils/data';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ActorSheetContext>>('store');

  $: allowEdit = FoundryAdapter.tryGetFlag<boolean>($store.actor, 'allow-edit');
  $: showResources =
    allowEdit ||
    $store.resources.some(
      (x) => !isNil(x.value) || !isNil(x.value, '') || !isNil(x.max)
    );

  const traitsMovedBelowResource =
    SettingsProvider.settings.traitsMovedBelowResource.get();
</script>

<div class="attributes-tab-contents">
  <section class="side-panel">
    <SkillsList />
    {#if !traitsMovedBelowResource}
      <Traits />
    {/if}
  </section>
  <section class="main-panel">
    {#if showResources}
      <Resources />
    {/if}
    {#if traitsMovedBelowResource}
      <Traits />
    {/if}
    <Favorites />
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
