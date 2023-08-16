<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/actor';
  import { formatAsModifier } from 'src/utils/formatting';
  import { submitText } from './form';
  import BlockTitle from './BlockTitle.svelte';
  import BlockScore from './BlockScore.svelte';

  export let initiative: { total: number; bonus: number };
  export let actor: Actor5e;

  const localize = FoundryAdapter.localize;
</script>

<!-- svelte-ignore a11y-missing-content -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="wrapper">
  <BlockTitle
    title={localize('DND5E.Initiative')}
    text={localize('T5EK.AbbrInitiative')}
    on:click={(event) => actor.rollInitiativeDialog({ event })}
  />
  <BlockScore>
    <span>{formatAsModifier(initiative.total)}</span>
  </BlockScore>
  <label class="ini-bonus">
    <span>{localize('T5EK.AbbrMod')}</span>
    <input
      class="ini-mod"
      type="text"
      placeholder="0"
      data-dtype="Number"
      value={initiative.bonus}
      maxlength="2"
      on:change|stopPropagation|preventDefault={(event) =>
        submitText(event, actor, 'system.attributes.init.bonus')}
    />
  </label>
  <a
    class="config-button"
    title={localize('DND5E.InitiativeConfig')}
    on:click={() =>
      new dnd5e.applications.actor.ActorInitiativeConfig(actor).render(true)}
  >
    <i class="fas fa-cog" />
  </a>
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

      .ini-mod {
        flex: 0 1 1px;
        line-height: 0.875rem;
        height: 0.875rem;
        padding: 1px 0;
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
  }
</style>
