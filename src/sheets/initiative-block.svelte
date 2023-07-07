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
    class="attribute-name rollable"
    title={localize('DND5E.Initiative')}
    on:click={(event) => actor.rollInitiativeDialog({ event })}
  >
    {localize('T5EK.AbbrInitiative')}
  </h4>
  <div class="total">{formatAsModifier(initiative.total)}</div>
  <div class="ini-bonus">
    <label>
      {localize('T5EK.AbbrMod')}
      <input
        class="ini-mod"
        name="system.attributes.init.bonus"
        type="text"
        placeholder="0"
        data-dtype="Number"
        value={initiative.bonus}
        maxlength="2"
      /></label
    >
  </div>
  <a
    data-tooltip={localize('DND5E.InitiativeConfig')}
    on:click={() =>
      new dnd5e.applications.actor.ActorInitiativeConfig(actor).render(true)}
  >
    <i class="fas fa-cog" />
  </a>
</div>
