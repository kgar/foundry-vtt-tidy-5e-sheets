<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { formatAsModifier } from 'src/utils/formatting';
  import BlockTitle from './RollableBlockTitle.svelte';
  import BlockScore from './BlockScore.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { CONSTANTS } from 'src/constants';

  export let initiative: { total: number; bonus: number };

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<div class="wrapper">
  <BlockTitle
    title={localize('DND5E.Initiative')}
    text={localize('TIDY5E.AbbrInitiative')}
    on:roll={(event) =>
      $context.actor.rollInitiativeDialog({ event: event.detail })}
  />
  <BlockScore>
    <span>{formatAsModifier(initiative.total)}</span>
  </BlockScore>
  <label class="ini-bonus" for="{$context.appId}-initiative-mod">
    <span>{localize('TIDY5E.AbbrMod')}</span>
    <TextInput
      document={$context.actor}
      field="system.attributes.init.bonus"
      class="ini-mod"
      placeholder="0"
      selectOnFocus={true}
      allowDeltaChanges={true}
      value={initiative.bonus}
      disabled={!$context.editable || !$context.unlocked}
      id="{$context.appId}-initiative-mod"
    />
  </label>

  {#if $context.editable && $context.unlocked}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      class="config-button icon-button inline-flex-row align-items-center"
      title={localize('DND5E.InitiativeConfig')}
      on:click={() =>
        FoundryAdapter.renderActorInitiativeConfig($context.actor)}
    >
      <i class="fas fa-cog" />
    </a>
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
        flex: 0 1 0.0625rem;
        line-height: 0.875rem;
        height: 0.875rem;
        padding: 0.0625rem 0;
      }
    }

    .config-button {
      font-size: 0.625rem;
      color: var(--t5e-tertiary-color);
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
