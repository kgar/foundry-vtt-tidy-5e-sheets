<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { TidySectionBase } from 'src/types/types';
  import { getContext } from 'svelte';

  type Props = {
    sheetDocument: any;
    section: TidySectionBase;
  };

  let { sheetDocument, section }: Props = $props();

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  const localize = FoundryAdapter.localize;

  function onAddClicked() {
    sheetDocument.sheet._addDocument({
      tabId,
      customSection: section.custom?.section,
      creationItemTypes: section.custom?.creationItemTypes,
      data: { type: section.key, ...section.dataset },
    });
  }
</script>

<a
  class="tidy-table-button"
  aria-label={localize('DND5E.ItemCreate')}
  data-tooltip
  onclick={onAddClicked}
>
  <i class="fas fa-plus"></i>
</a>
