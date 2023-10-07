<script lang="ts">
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import TextInput from 'src/components/form/TextInput.svelte';

  let store =
    getContext<Readable<CharacterSheetContext | NpcSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<div class="profile-temp">
  <TextInput
    document={$store.actor}
    field="system.attributes.hp.temp"
    cssClass="temphp"
    placeholder="+{localize('DND5E.Temp')}"
    value={$store.hp.temp || null}
    dtype="Number"
    allowDeltaChanges={true}
    maxlength={5}
    title={localize('DND5E.HitPointsTemp')}
  />
  <TextInput
    document={$store.actor}
    field="system.attributes.hp.tempmax"
    cssClass="max-temphp"
    placeholder="+{localize('DND5E.Max')}"
    value={$store.hp.tempmax || null}
    dtype="Number"
    allowDeltaChanges={true}
    maxlength={5}
    title={localize('DND5E.HitPointsTempMax')}
  />
  <a
    title={localize('DND5E.HitPointsConfig')}
    on:click|stopPropagation|preventDefault={(event) =>
      new dnd5e.applications.actor.ActorHitPointsConfig($store.actor).render(
        true
      )}
  >
    <i class="fas fa-cog" />
  </a>
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
