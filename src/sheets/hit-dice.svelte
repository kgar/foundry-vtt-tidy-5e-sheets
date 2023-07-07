<script lang="ts">
  import { FoundryAdapter, type Actor5e } from 'src/foundry/foundry-adapter';

  export let hitDice: number;
  export let actorLevel: number;
  export let actor: Actor5e;

  const localize = FoundryAdapter.localize;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->
<div
  data-tooltip="{localize(
    'DND5E.HitDice'
  )}: {hitDice}/{actorLevel}&#10;{localize('DND5E.HitDiceConfig')}"
>
  <a
    on:click={new dnd5e.applications.actor.ActorHitDiceConfig(actor).render(
      true
    )}>{hitDice}</a
  >
</div>
