<script lang="ts">
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { settingStore } from 'src/settings/settings';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<CharacterSheetContext | NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<div class="profile-temp">
  <TextInput
    document={$context.actor}
    field="system.attributes.hp.temp"
    class="temphp"
    placeholder="+{localize('DND5E.Temp')}"
    value={$context.hp.temp || null}
    allowDeltaChanges={true}
    maxlength={5}
    title={localize('DND5E.HitPointsTemp')}
    disabled={!$context.editable}
  />
  <TextInput
    document={$context.actor}
    field="system.attributes.hp.tempmax"
    class="max-temphp"
    placeholder="+{localize('DND5E.Max')}"
    value={$context.hp.tempmax || null}
    allowDeltaChanges={true}
    maxlength={5}
    title={localize('DND5E.HitPointsTempMax')}
    disabled={!$context.editable}
  />
  {#if $context.editable && $context.unlocked}
    <button
      type="button"
      class="inline-icon-button"
      title={localize('DND5E.HitPointsConfig')}
      on:click|stopPropagation|preventDefault={() =>
        FoundryAdapter.renderActorHitPointsDialog($context.actor)}
      tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
    >
      <i class="fas fa-cog" />
    </button>
  {/if}
</div>

<style lang="scss">
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
