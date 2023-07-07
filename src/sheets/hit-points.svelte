<script lang="ts">
  import { FoundryAdapter, type Actor5e } from 'src/foundry/foundry-adapter';

  export let value: number;
  export let max: number;
  export let actor: Actor5e;

  const localize = FoundryAdapter.localize;
</script>

<input
  name="system.attributes.hp.value"
  type="text"
  {value}
  placeholder="10"
  data-tooltip={localize('DND5E.HitPointsCurrent')}
  data-dtype="Number"
  maxlength="5"
  aria-describedby="tooltip"
/>
<span> / </span>
<!-- TODO: Implement "Allow Max HP Override" / T5EK.Settings.AllowHpMaxOverride -->
<span
  data-tooltip={max
    ? localize('DND5E.HitPointsOverride')
    : localize('DND5E.HitPointsMax')}
>
  {max}</span
>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->
<a
  data-tooltip={localize('DND5E.HitPointsConfig')}
  on:click={new dnd5e.applications.actor.ActorHitPointsConfig(actor).render(
    true
  )}
>
  <i class="fas fa-cog" />
</a>
