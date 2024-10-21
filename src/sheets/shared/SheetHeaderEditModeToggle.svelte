<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import TidySwitch from 'src/components/toggle/TidySwitch.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  async function toggleLock() {
    await TidyFlags.allowEdit.set($context.actor, !allowEdit);
  }

  $: allowEdit = TidyFlags.allowEdit.get($context.actor);

  $: descriptionVariable = $settingStore.useTotalSheetLock
    ? localize('TIDY5E.SheetLock.Description')
    : localize('TIDY5E.SheetEdit.Description');
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

{#if $context.editable}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="header-sheet-edit-mode-toggle {$$restProps.class ?? ''}"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SHEET_LOCK_TOGGLE}
    on:dblclick|stopPropagation
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
