<script lang="ts">
  import type { ActorSheetContext } from 'src/types/types';
  import SkillsList from '../attributes/SkillsList.svelte';
  import Traits from '../../sheets/actor/Traits.svelte';
  import Favorites from '../attributes/Favorites.svelte';
  import Resources from '../attributes/Resources.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { currentSettings } from 'src/settings/settings';

  let store = getContext<Readable<ActorSheetContext>>('store');

  $: allowEdit = FoundryAdapter.tryGetFlag<boolean>($store.actor, 'allow-edit');
  $: showResources =
    allowEdit ||
    $store.resources.some(
      (x) => !isNil(x.value) || !isNil(x.value, '') || !isNil(x.max)
    );

  const traitsMovedBelowResource = $currentSettings.traitsMovedBelowResource;
</script>

<div class="attributes-tab-contents">
  <section class="side-panel">
    <SkillsList actor={$store.actor} />
    {#if !traitsMovedBelowResource}
      <Traits toggleable={$currentSettings.traitsTogglePc} />
    {/if}
  </section>
  <section class="main-panel">
    {#if showResources}
      <Resources />
    {/if}
    {#if traitsMovedBelowResource}
      <Traits toggleable={$currentSettings.traitsTogglePc} />
    {/if}
    <Favorites />
  </section>
</div>

<style lang="scss">
  .attributes-tab-contents {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
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
    height: auto;
    overflow-x: auto;
  }
</style>
