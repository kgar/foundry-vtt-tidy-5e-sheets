<script lang="ts">
  import RerenderAfterFormSubmission from 'src/components/utility/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import SheetEditor from '../../components/editor/SheetEditor.svelte';
  import LimitedHeader from '../actor/LimitedHeader.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<VehicleSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<div class="limited-vehicle">
  <LimitedHeader rounded={$context.useRoundedPortraitStyle} />
  <section class="tidy-sheet-body">
    <div class="note-entries">
      <RerenderAfterFormSubmission
        andOnValueChange={$context.system.details.biography.value}
      >
        <article class="biography-notes" use:$context.activateEditors>
          <div class="section-titles">
            {localize('DND5E.Description')}
          </div>
          <SheetEditor
            content={$context.biographyHTML}
            target="system.details.biography.value"
            editable={$context.editable}
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

  .tidy-sheet-body {
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
