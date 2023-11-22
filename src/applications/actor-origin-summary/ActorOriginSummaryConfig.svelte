<script lang="ts">
  import { getContext } from 'svelte';
  import type { ActorOriginSummaryContext } from './ActorOriginSummaryConfigApplication';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ActorOriginSummaryContext>>('context');
  let appId = getContext<string>('appId');
  let save = getContext<Function>('save');

  const localize = FoundryAdapter.localize;
</script>

<form class="flex-column" on:submit|preventDefault={() => save()}>
  {#if $context.isCharacter}
    {#if $context.canEditRace}
      <div class="form-field">
        <label for="race-edit-{appId}">{localize('DND5E.Race')}</label>

        <input
          id="race-edit-{appId}"
          type="text"
          placeholder={localize('DND5E.Race')}
          bind:value={$context.race}
      />
      </div>
    {/if}
    <div class="form-field">
      <label for="background-edit-{appId}">{localize('DND5E.Background')}</label
      >
      {#if $context.canEditBackground}
        <input
          id="background-edit-{appId}"
          type="text"
          placeholder={localize('DND5E.Background')}
          bind:value={$context.background}
        />
      {:else}
        <span>{$context.background}</span>
      {/if}
    </div>
    <div class="form-field">
      <label for="pc-alignment-edit-{appId}"
        >{localize('DND5E.Alignment')}</label
      >
      <input
        id="alignment-edit-{appId}"
        type="text"
        placeholder={localize('DND5E.Alignment')}
        bind:value={$context.alignment}
      />
    </div>
  {:else if $context.isNpc}
    <div class="environment form-field">
      <label for="environment-edit-{appId}"
        >{localize('T5EK.Environment')}</label
      >
      <input
        id="environment-edit-{appId}"
        type="text"
        placeholder={localize('T5EK.Environment')}
        bind:value={$context.environment}
      />
    </div>
    <div class="form-field">
      <label for="alignment-edit-{appId}">{localize('DND5E.Alignment')}</label>
      <input
        id="alignment-edit-{appId}"
        type="text"
        placeholder={localize('DND5E.Alignment')}
        bind:value={$context.alignment}
      />
    </div>
  {:else if $context.isVehicle}
    <div class="form-field">
      <label for="dimensions-edit-{appId}">{localize('DND5E.Dimensions')}</label
      >
      <textarea
        id="dimensions-edit-{appId}"
        rows="4"
        cols="50"
        name="dimensions"
        placeholder={localize('DND5E.Dimensions')}
        bind:value={$context.dimensions}
      />
    </div>
  {/if}

  <button type="button" on:click={() => save()}>
    <i class="far fa-save" />
    {localize('Save')}
  </button>
</form>
