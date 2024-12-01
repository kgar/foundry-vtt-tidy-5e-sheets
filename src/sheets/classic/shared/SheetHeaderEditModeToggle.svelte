<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import { CONSTANTS } from 'src/constants';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import TidySwitch from 'src/components/toggle/TidySwitch.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  interface Props {
    [key: string]: any;
  }

  let { ...rest }: Props = $props();

  let context = getContext<Readable<{ document: any; editable: boolean }>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  async function toggleLock() {
    await TidyFlags.allowEdit.set($context.document, !allowEdit);
  }

  const localize = FoundryAdapter.localize;
  let allowEdit = $derived(TidyFlags.allowEdit.get($context.document));
  let descriptionVariable = $derived(
    $settingStore.useTotalSheetLock
      ? localize('TIDY5E.SheetLock.Description')
      : localize('TIDY5E.SheetEdit.Description'),
  );
  let lockHintVariable = $derived(
    $settingStore.useTotalSheetLock
      ? 'TIDY5E.SheetLock.Unlock.Hint'
      : 'TIDY5E.SheetEdit.Enable.Hint',
  );
  let unlockHintVariable = $derived(
    $settingStore.useTotalSheetLock
      ? 'TIDY5E.SheetLock.Lock.Hint'
      : 'TIDY5E.SheetEdit.Disable.Hint',
  );
  let unlockTitle = $derived(
    localize(unlockHintVariable, {
      description: descriptionVariable,
    }),
  );
  let lockTitle = $derived(
    localize(lockHintVariable, {
      description: descriptionVariable,
    }),
  );
</script>

{#if $context.editable}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="header-sheet-edit-mode-toggle {rest.class ?? ''}"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SHEET_LOCK_TOGGLE}
    ondblclick={(event) => {
      event.stopPropagation();
      bubble('dblclick')(event);
    }}
  >
    <TidySwitch
      --tidy-switch-scale="1"
      --tidy-switch-thumb-transform-duration="0.15s"
      title={allowEdit ? unlockTitle : lockTitle}
      checked={allowEdit}
      thumbIconClass="{allowEdit ? 'fas fa-unlock' : 'fas fa-lock'} fa-fw"
      on:change={() => toggleLock()}
    ></TidySwitch>
  </div>
{/if}
