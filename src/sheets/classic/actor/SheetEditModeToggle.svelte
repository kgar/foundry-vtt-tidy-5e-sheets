<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import TidySwitch from 'src/components/toggle/TidySwitch.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let hint: string | null = null;

  let context = getContext<Readable<{ document: any }>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  async function toggleLock() {
    await TidyFlags.allowEdit.set($context.document, !allowEdit);
  }

  $: allowEdit = TidyFlags.allowEdit.get($context.document);

  $: descriptionVariable =
    hint ??
    ($settingStore.useTotalSheetLock
      ? localize('TIDY5E.SheetLock.Description')
      : localize('TIDY5E.SheetEdit.Description'));
  $: lockHintVariable = $settingStore.useTotalSheetLock
    ? 'TIDY5E.SheetLock.Unlock.Hint'
    : 'TIDY5E.SheetEdit.Enable.Hint';
  $: unlockHintVariable = $settingStore.useTotalSheetLock
    ? 'TIDY5E.SheetLock.Lock.Hint'
    : 'TIDY5E.SheetEdit.Disable.Hint';
  $: unlockTitle = localize(unlockHintVariable, {
    description: descriptionVariable,
  });
  $: lockTitle = localize(lockHintVariable, {
    description: descriptionVariable,
  });

  const localize = FoundryAdapter.localize;
</script>

<div
  class="sheet-edit-mode-toggle {$$restProps.class ?? ''}"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SHEET_LOCK_TOGGLE}
>
  <TidySwitch
    --tidy-switch-scale="1"
    --tidy-switch-thumb-transform-duration="0.15s"
    title={allowEdit ? unlockTitle : lockTitle}
    value={allowEdit}
    thumbIconClass="{allowEdit ? 'fas fa-unlock' : 'fas fa-lock'} fa-fw"
    on:change={() => toggleLock()}
  ></TidySwitch>
</div>
