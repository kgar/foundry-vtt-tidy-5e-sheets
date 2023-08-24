<script lang="ts">
  import RerenderAfterFormSubmission from 'src/components/shared/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import SheetEditor from '../SheetEditor.svelte';
  import { SettingsProvider } from 'src/settings/settings';

  let store = getContext<Readable<NpcSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  $: portraitStyle = SettingsProvider.settings.portraitStyle.get();
  $: useRoundedPortraitStyle = ['all', 'npc'].includes(portraitStyle);

  function activateProseMirrorListeners(node: HTMLElement) {
    $store.activateFoundryJQueryListeners(node);
  }
</script>

<div class="limited-character">
  <header>
    <div class="profile">
      <div class="portrait" class:rounded={useRoundedPortraitStyle}>
        <img src={$store.actor.img} alt={$store.actor.name} data-edit="img" />
      </div>
    </div>
  </header>

  <section class="sheet-body">
    <div class="note-entries">
      <RerenderAfterFormSubmission
        andOnValueChange={$store.system.details.biography.value}
      >
        <article class="appearance-notes" use:activateProseMirrorListeners>
          <div class="section-titles biopage">
            {localize('DND5E.Appearance')}
          </div>
          <SheetEditor
            content={$store.system.details.appearance}
            target="system.details.appearance"
            editable={$store.editable}
          />
        </article>
        <article class="biography-notes" use:activateProseMirrorListeners>
          <div class="section-titles">
            {localize('DND5E.Background')}/{localize('DND5E.Biography')}
          </div>
          <SheetEditor
            content={$store.biographyHTML}
            target="system.details.biography.value"
            editable={$store.editable}
          />
        </article>
      </RerenderAfterFormSubmission>
    </div>
  </section>
</div>

<style lang="scss">
  .limited-character {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  header {
    display: flex;
    justify-content: center;
    padding: 0.625rem 1rem 1rem 1rem;
    background: var(--t5e-header-background);
  }

  .profile {
    width: 9.375rem;
    height: 9.375rem;
  }

  .portrait {
    width: 100%;
    height: 100%;
    border-radius: 0.3125rem;
    overflow: hidden;
    border: 1px solid var(--t5e-icon-outline);
    mix-blend-mode: normal;

    &.rounded {
      border-radius: 50%;
    }
  }

  .sheet-body {
    flex: 1;
    margin-right: 1rem;

    .note-entries {
      height: 100%;
      display: flex;
      flex-direction: row;
      gap: 0.5rem;

      > * {
        flex: 1;
        min-width: 0;
      }
    }
  }
</style>
