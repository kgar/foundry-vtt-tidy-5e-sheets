<script lang="ts">
  import RerenderAfterFormSubmission from 'src/components/shared/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import SheetEditor from '../SheetEditor.svelte';
  import { SettingsProvider } from 'src/settings/settings';
  import LimitedHeader from '../actor/LimitedHeader.svelte';

  let store = getContext<Readable<NpcSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  $: portraitStyle = SettingsProvider.settings.portraitStyle.get();
  $: useRoundedPortraitStyle = ['all', 'npc'].includes(portraitStyle);

  function activateProseMirrorListeners(node: HTMLElement) {
    $store.activateFoundryJQueryListeners(node);
  }
</script>

<div class="limited-character">
  <LimitedHeader rounded={useRoundedPortraitStyle} />
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
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
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
