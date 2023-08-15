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
    padding: 10px 16px 16px 16px;
    background: var(--t5e-header-background);
  }

  .portrait {
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
