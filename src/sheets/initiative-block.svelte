<script lang="ts">
  import { FoundryAdapter, type Actor5e } from 'src/foundry/foundry-adapter';
  import { formatAsModifier } from 'src/utils/formatting';

  export let initiative: { total: number; bonus: number };
  export let actor: Actor5e;

  const localize = FoundryAdapter.localize;
</script>

<!-- svelte-ignore a11y-missing-content -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="wrapper">
  <h4
    class="attribute-name block-title rollable"
    title={localize('DND5E.Initiative')}
    on:click={(event) => actor.rollInitiativeDialog({ event })}
  >
    {localize('T5EK.AbbrInitiative')}
  </h4>
  <div class="block-score">
    <span>{formatAsModifier(initiative.total)}</span>
  </div>
  <label class="ini-bonus">
    <span>{localize('T5EK.AbbrMod')}</span>
    <input
      class="ini-mod"
      name="system.attributes.init.bonus"
      type="text"
      placeholder="0"
      data-dtype="Number"
      value={initiative.bonus}
      maxlength="2"
    />
  </label>
  <a
    class="config-button"
    data-tooltip={localize('DND5E.InitiativeConfig')}
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

    .block-score {
      margin: 0.125rem 0 0.125rem 0;
      padding: 0;
      display: flex;
      justify-content: center;
      height: auto;
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
