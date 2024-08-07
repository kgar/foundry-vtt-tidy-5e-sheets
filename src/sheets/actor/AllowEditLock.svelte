<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import TidySwitch from 'src/components/toggle/TidySwitch.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let hint: string | null = null;

  let context = getContext<Readable<ActorSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  async function toggleLock() {
    await TidyFlags.allowEdit.set($context.actor, !allowEdit);
  }

  $: allowEdit = TidyFlags.allowEdit.get($context.actor);

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

<div class="toggle-allow-edit {$$restProps.class ?? ''}">
  <TidySwitch
    --tidy-switch-scale=".875"
    --tidy-switch-thumb-transform-duration="0.15s"
    title={allowEdit ? unlockTitle : lockTitle}
    value={allowEdit}
    thumbIconClass="{allowEdit ? 'fas fa-unlock' : 'fas fa-lock'} fa-fw"
    on:change={() => toggleLock()}
  ></TidySwitch>
</div>

<style lang="scss">
  .toggle-allow-edit {
    display: flex;
    flex: 0;
    flex-basis: 3rem;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    background: var(--t5e-tab-background);
    border: 0.0625rem solid transparent;
    border-bottom: 0.0625rem solid var(--t5e-tab-strip-border-color);
    font-size: 0.8125rem;
    text-align: left;
    height: 1.625rem;
  }
</style>
