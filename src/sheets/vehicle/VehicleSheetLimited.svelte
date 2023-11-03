<script lang="ts">
  import RerenderAfterFormSubmission from 'src/components/utility/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import SheetEditor from '../../components/editor/SheetEditor.svelte';
  import LimitedHeader from '../actor/LimitedHeader.svelte';

  let context = getContext<Readable<VehicleSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  function activateProseMirrorListeners(node: HTMLElement) {
    $context.activateFoundryJQueryListeners(node);
  }
</script>

<div class="limited-vehicle">
  <LimitedHeader rounded={$context.useRoundedPortraitStyle} />
  <section class="sheet-body">
    <div class="note-entries">
      <RerenderAfterFormSubmission
        andOnValueChange={$context.system.details.biography.value}
      >
        <article class="biography-notes" use:activateProseMirrorListeners>
          <div class="section-titles">
            {localize('DND5E.Description')}
          </div>
          <SheetEditor
            content={$context.biographyHTML}
            target="system.details.biography.value"
            editable={$context.owner || FoundryAdapter.userIsGm()}
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
