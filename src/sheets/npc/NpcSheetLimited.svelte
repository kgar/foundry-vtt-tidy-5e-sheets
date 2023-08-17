<script lang="ts">
  import RerenderAfterFormSubmission from 'src/components/shared/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import SheetEditor from '../SheetEditor.svelte';

  let store = getContext<Readable<NpcSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  function activateProseMirrorListeners(node: HTMLElement) {
    $store.activateFoundryJQueryListeners(node);
  }
</script>

<div class="limited-npc">
  <header>
    <div class="profile">
      <div class="portrait">
        <img src={$store.actor.img} alt={$store.actor.name} data-edit="img" />
      </div>
    </div>
  </header>

  <section class="sheet-body">
    <div class="note-entries">
      <RerenderAfterFormSubmission
        andOnValueChange={$store.system.details.biography.value}
      >
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
  .limited-npc {
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
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid var(--t5e-icon-outline);
    mix-blend-mode: normal;
  }

  .sheet-body {
    flex: 1;
    margin-right: 1rem;

    .note-entries {
      height: 100%;

      .biography-notes {
        height: 100%;
      }
    }
  }
</style>
