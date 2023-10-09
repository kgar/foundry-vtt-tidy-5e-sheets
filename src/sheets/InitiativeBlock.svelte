<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { formatAsModifier } from 'src/utils/formatting';
  import BlockTitle from './RollableBlockTitle.svelte';
  import BlockScore from './BlockScore.svelte';
  import TextInput from 'src/components/form/TextInput.svelte';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let initiative: { total: number; bonus: number };

  let store = getContext<Readable<ActorSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<div class="wrapper">
  <BlockTitle
    title={localize('DND5E.Initiative')}
    text={localize('T5EK.AbbrInitiative')}
    on:roll={(event) =>
      $store.actor.rollInitiativeDialog({ event: event.detail })}
  />
  <BlockScore>
    <span>{formatAsModifier(initiative.total)}</span>
  </BlockScore>
  <label class="ini-bonus" for="{$store.appId}-initiative-mod">
    <span>{localize('T5EK.AbbrMod')}</span>
    <TextInput
      document={$store.actor}
      field="system.attributes.init.bonus"
      cssClass="ini-mod"
      placeholder="0"
      dtype="Number"
      selectOnFocus={true}
      allowDeltaChanges={true}
      value={initiative.bonus}
      maxlength={2}
      disabled={!$store.owner || $store.lockSensitiveFields}
      id="{$store.appId}-initiative-mod"
    />
  </label>

  {#if $store.owner && !$store.lockSensitiveFields}
    <button
      type="button"
      class="config-button icon-button"
      title={localize('DND5E.InitiativeConfig')}
      on:click={() =>
        new dnd5e.applications.actor.ActorInitiativeConfig($store.actor).render(
          true
        )}
    >
      <i class="fas fa-cog" />
    </button>
  {:else}
    <span
      class="config-button invisible"
      title={localize('DND5E.InitiativeConfig')}
      role="presentation"
    >
      <i class="fas fa-cog" />
    </span>
  {/if}
</div>

<style lang="scss">
  .wrapper {
    text-align: center;
    display: flex;
    flex-direction: column;

    :global(.block-score) {
      margin-top: 0.0625rem;
      margin-bottom: 0.1875rem;
    }

    .ini-bonus {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.75rem;
      line-height: 0.875rem;

      :global(.ini-mod) {
        flex: 0 1 1px;
        line-height: 0.875rem;
        height: 0.875rem;
        padding: 1px 0;
      }
    }

    .config-button {
      font-size: 0.625rem;
      color: var(--t5ek-tertiary-color);
      display: flex;
      justify-content: center;
      align-items: flex-end;
      min-height: 0.75rem;
    }

    .invisible {
      visibility: hidden;
    }
  }
</style>
