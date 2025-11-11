<script lang="ts">
  import { FoundryAdapter } from '../../../foundry/foundry-adapter';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getSheetContext<ActorSheetContextV1>());
</script>

{#if context.saves.concentration}
  {@const save = context.saves.concentration}
  <span class="special-save">
    <button
      type="button"
      class="inline-transparent-button flex-row extra-small-gap align-items-center highlight-on-hover"
      onclick={(ev) =>
        context.actor.rollConcentration({ event: ev, legacy: false })}
    >
      <Dnd5eIcon src="systems/dnd5e/icons/svg/statuses/concentrating.svg" />
      {save.label}:
      <span class="special-save-mod">{save.sign}{save.mod}</span>
    </button>
    {#if context.unlocked}
      <button
        type="button"
        class="inline-icon-button"
        onclick={() => FoundryAdapter.openConcentrationConfig(context.actor)}
        ><i class="fas fa-cog" style="font-size: var(--icon-size);"></i></button
      >
    {/if}
  </span>
{/if}

<style lang="less">
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
