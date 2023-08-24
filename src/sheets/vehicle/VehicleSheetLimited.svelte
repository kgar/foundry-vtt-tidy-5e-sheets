<script lang="ts">
  import RerenderAfterFormSubmission from 'src/components/shared/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import SheetEditor from '../SheetEditor.svelte';
  import { SettingsProvider } from 'src/settings/settings';
    import VerticalLineSeparator from 'src/components/layout/VerticalLineSeparator.svelte';

  let store = getContext<Readable<VehicleSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  $: portraitStyle = SettingsProvider.settings.portraitStyle.get();
  $: useRoundedPortraitStyle = ['all', 'vehicle'].includes(portraitStyle);

  function activateProseMirrorListeners(node: HTMLElement) {
    $store.activateFoundryJQueryListeners(node);
  }
</script>

<div class="limited-vehicle">
  <header>
    <div class="profile">
      <div class="portrait" class:rounded={useRoundedPortraitStyle}>
        <img src={$store.actor.img} alt={$store.actor.name} data-edit="img" />
      </div>
    </div>
    <h1>{$store.actor.name}</h1>
  </header>

  <section class="sheet-body">
    <div class="note-entries">
      <RerenderAfterFormSubmission
        andOnValueChange={$store.system.details.biography.value}
      >
        <article class="biography-notes" use:activateProseMirrorListeners>
          <div class="section-titles">
            {localize('DND5E.Description')}
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
  .limited-vehicle {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 1rem;
    background: var(--t5e-header-background);
  }

  .profile {
    width: 9.375rem;
    height: 9.375rem;
    flex: 0 0 auto;
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
    display: flex;

    .note-entries {
      height: 100%;
      display: flex;
      flex-direction: row;
    }
  }
</style>
