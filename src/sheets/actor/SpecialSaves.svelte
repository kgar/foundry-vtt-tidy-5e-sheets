<script lang="ts">
  import { getContext } from 'svelte';
  import { FoundryAdapter } from '../../foundry/foundry-adapter';
  import type { Readable } from 'svelte/store';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import type { ActorSheetContext } from 'src/types/types';

  let context = getContext<Readable<ActorSheetContext>>('context');
</script>

{#if $context.saves.concentration}
  {@const save = $context.saves.concentration}
  <span class="special-save">
    <button
      type="button"
      class="inline-transparent-button flex-row extra-small-gap align-items-center highlight-on-hover"
      on:click={(ev) => $context.actor.rollConcentration({ event: ev })}
    >
      <Dnd5eIcon src="systems/dnd5e/icons/svg/statuses/concentrating.svg" />
      {save.label}:
      <span class="special-save-mod">{save.sign}{save.mod}</span>
    </button>
    {#if $context.unlocked}
      <button
        type="button"
        class="inline-icon-button"
        on:click={() =>
          FoundryAdapter.openActorConcentrationConfig($context.actor)}
        ><i class="fas fa-cog" style="font-size: var(--icon-size);"></i></button
      >
    {/if}
  </span>
{/if}

<style lang="scss">
  .special-save {
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    align-items: center;
    font-size: 0.75rem;

    --icon-fill: var(--t5e-icon-hover-color);

    button {
      font-weight: 700;
    }
  }
</style>
