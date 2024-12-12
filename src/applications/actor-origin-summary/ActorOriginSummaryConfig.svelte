<script lang="ts">
  import { getContext } from 'svelte';
  import type { ActorOriginSummaryContext } from './ActorOriginSummaryConfigFormApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<ActorOriginSummaryContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  let appId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.APP_ID);

  const localize = FoundryAdapter.localize;
</script>

<section class="flex-column">
  {#if context.isCharacter}
    <div class="form-field">
      <label for="background-edit-{appId}">{localize('DND5E.Background')}</label
      >
      {#if context.canEditBackground}
        <input
          id="background-edit-{appId}"
          type="text"
          placeholder={localize('DND5E.Background')}
          bind:value={context.background}
        />
      {:else}
        <span>{context.background}</span>
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
        bind:value={context.alignment}
      />
    </div>
  {:else if context.isNpc}
    <div class="environment form-field">
      <label for="environment-edit-{appId}"
        >{localize('TIDY5E.Environment')}</label
      >
      <input
        id="environment-edit-{appId}"
        type="text"
        placeholder={localize('TIDY5E.Environment')}
        bind:value={context.environment}
      />
    </div>
    <div class="form-field">
      <label for="alignment-edit-{appId}">{localize('DND5E.Alignment')}</label>
      <input
        id="alignment-edit-{appId}"
        type="text"
        placeholder={localize('DND5E.Alignment')}
        bind:value={context.alignment}
      />
    </div>
  {:else if context.isVehicle}
    <div class="form-field">
      <label for="dimensions-edit-{appId}">{localize('DND5E.Dimensions')}</label
      >
      <textarea
        id="dimensions-edit-{appId}"
        rows="4"
        cols="50"
        name="dimensions"
        placeholder={localize('DND5E.Dimensions')}
        bind:value={context.dimensions}
      ></textarea>
    </div>
  {/if}

  <button type="submit">
    <i class="far fa-save"></i>
    {localize('Save')}
  </button>
</section>
