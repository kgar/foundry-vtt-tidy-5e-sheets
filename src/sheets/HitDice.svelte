<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/actor';

  export let hitDice: number;
  export let actorLevel: number;
  export let actor: Actor5e;
  export let useRoundedPortraitStyle: boolean;

  const localize = FoundryAdapter.localize;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="portrait-hd"
  class:rounded={useRoundedPortraitStyle}
  data-tooltip="{localize(
    'DND5E.HitDice'
  )}: {hitDice}/{actorLevel}&#10;{localize('DND5E.HitDiceConfig')}"
>
  <a
    class="current-hd config-button"
    on:click={new dnd5e.applications.actor.ActorHitDiceConfig(actor).render(
      true
    )}>{hitDice}</a
  >
</div>

<style lang="scss">
  .portrait-hd {
    position: absolute;
    z-index: 25;
    right: 0;
    bottom: 0;
    width: 34px;
    height: 34px;
    background: var(--t5e-icon-background);
    box-shadow: 0 0 10px var(--t5e-icon-shadow) inset;
    border: 1px solid var(--t5e-icon-outline);
    border-radius: 5px 0 5px 0px;
    color: var(--t5e-icon-font);

    &.rounded {
      bottom: -7px;
      border-radius: 50%;
    }

    .current-hd {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      font-family: var(--t5e-modesto);
      font-size: 20px;
      font-weight: 700;
      padding: 2px 0 0 0;
    }
  }
</style>
