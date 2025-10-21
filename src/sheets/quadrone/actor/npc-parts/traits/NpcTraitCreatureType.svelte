<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ActorTraitPills from 'src/sheets/quadrone/actor/parts/ActorTraitPills.svelte';
  import { isNil } from 'src/utils/data';
  import type { ActorTraitContext } from 'src/types/types';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let species = $derived(context.creatureType);
  let onconfig = () => FoundryAdapter.renderCreatureTypeConfig(context.actor);

  let creatureTypeEntries = $derived.by(() => {
    let result: ActorTraitContext[] = [];

    if (!isNil(context.system.details.type.label, '')) {
      result.push({ label: context.system.details.type.label });
    }

    return result;
  });

</script>

{#if context.unlocked}
  <!-- Species -->
  <div class="list-entry traits-creature-type">
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class="fa-solid fa-paw"></i>
        {localize('DND5E.CreatureType')}
      </h4>
      {#if context.unlocked}
        <button
          aria-label={localize('DND5E.CreatureType.Add')}
          type="button"
          class="button button-borderless button-icon-only button-config flexshrink"
          data-tooltip={localize('DND5E.CreatureType.Add')}
          onclick={onconfig}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </div>
    <div class="list-content">
      <div class="list-values trait-item">
        <ActorTraitPills values={creatureTypeEntries} />
      </div>
    </div>
  </div>
{/if}
