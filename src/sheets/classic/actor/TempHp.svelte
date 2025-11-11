<script lang="ts">
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  let context =
    $derived(getSheetContext<CharacterSheetContext | NpcSheetContext>());

  const localize = FoundryAdapter.localize;
</script>

<div class="profile-temp">
  <TextInput
    document={context.actor}
    field="system.attributes.hp.temp"
    class="temphp"
    placeholder="+{localize('DND5E.Temp')}"
    value={context.hp.temp?.toString() ?? ''}
    allowDeltaChanges={true}
    title={localize('DND5E.HitPointsTemp')}
    disabled={!context.editable}
    selectOnFocus={true}
  />
  <TextInput
    document={context.actor}
    field="system.attributes.hp.tempmax"
    class="max-temphp"
    placeholder="+{localize('DND5E.Max')}"
    value={context.hp.tempmax?.toString() ?? ''}
    title={localize('DND5E.HitPointsTempMax')}
    disabled={!context.editable}
    selectOnFocus={true}
  />
  {#if context.editable && context.unlocked}
    <button
      type="button"
      class="inline-icon-button"
      title={localize('DND5E.HitPointsConfig')}
      onclick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        FoundryAdapter.renderHitPointsDialog(context.actor);
      }}
      tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
    >
      <i class="fas fa-cog"></i>
    </button>
  {/if}
</div>

<style lang="less">
  .profile-temp {
    display: flex;
    justify-content: center;

    :global(input) {
      flex: 0 0 2.1875rem; // Or hard width
      display: flex;
      font-size: 0.75rem;
      line-height: 0.75rem;
      height: 0.875rem;
      padding: 0.0625rem 0;
    }

    :global(input.temphp) {
      text-align: center;
    }

    :global(input.max-temphp) {
      text-align: center;
    }
  }
</style>
