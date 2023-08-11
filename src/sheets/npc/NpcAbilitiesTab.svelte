<script lang="ts">
  import SkillsList from 'src/components/attributes/SkillsList.svelte';
  import Traits from '../actor/Traits.svelte';
  import { SettingsProvider } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { NpcSheetContext } from 'src/types/types';
  import Currency from '../actor/Currency.svelte';

  let store = getContext<Readable<NpcSheetContext>>('store');
</script>

<section class="npc-abilities-content">
  <div class="side-panel">
    <SkillsList
      actor={$store.actor}
      toggleable={!SettingsProvider.settings.skillsAlwaysShownNpc.get()}
    />
    <Traits
      toggleable={!SettingsProvider.settings.traitsAlwaysShownNpc.get()}
    />
  </div>
  <div class="main-panel">Favorites</div>
</section>
<footer>
  <Currency actor={$store.actor} />
</footer>

<style lang="scss">
  .npc-abilities-content {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    overflow-y: scroll;

    > .side-panel {
      flex: 0 0 13.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    > .main-panel {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
      padding: 0;
      height: auto;
      overflow-x: auto;
    }
  }

  footer {
    background-color: var(--t5e-header-background);
    display: flex;
    flex-direction: row;
    justify-content: center;
    box-shadow: 0 0 0.1875rem 0 var(--t5e-tertiary-color);

    margin: 0 -0.25rem -1rem -1rem;

    :global(> *) {
      flex-basis: 30rem;
    }
  }
</style>
