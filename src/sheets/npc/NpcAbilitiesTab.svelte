<script>
  import SkillsList from 'src/components/attributes/SkillsList.svelte';
  import Traits from '../actor/Traits.svelte';
  import { SettingsProvider } from 'src/settings/settings';
</script>

<section class="npc-abilities-content">
  <div class="side-panel">
    <SkillsList />
    <Traits
      toggleable={!SettingsProvider.settings.traitsAlwaysShownNpc.get()}
    />
  </div>
  <div class="main-panel">Favorites</div>
</section>
<footer>The footer</footer>

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
</style>
