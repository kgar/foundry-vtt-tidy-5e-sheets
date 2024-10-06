<script lang="ts">
  import { getContext } from 'svelte';
  import { FoundryAdapter } from '../../foundry/foundry-adapter';
  import type { Readable } from 'svelte/store';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

{#if $context.saves.concentration}
  {@const save = $context.saves.concentration}
  <span class="special-save">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      class="concentration-roller inline-transparent-button flex-row extra-small-gap align-items-center highlight-on-hover"
      on:click={(ev) => $context.actor.rollConcentration({ event: ev })}
    >
      <Dnd5eIcon src="systems/dnd5e/icons/svg/statuses/concentrating.svg" />
      {save.label}:
      <span class="special-save-mod">{save.sign}{save.mod}</span>
    </a>
    {#if $context.unlocked}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        class="configure-concentration inline-icon-button"
        on:click={() =>
          FoundryAdapter.openActorConcentrationConfig($context.actor)}
        ><i class="fas fa-cog" style="font-size: var(--icon-size);"></i>
      </a>
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

    * {
      font-weight: 700;
    }
  }
</style>
