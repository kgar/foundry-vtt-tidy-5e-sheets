<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ChosenFacilityContext } from 'src/types/types';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import type { Item5e } from 'src/types/item.types';
  import FacilityOrderProgressMeterQuadrone from './FacilityOrderProgressMeterQuadrone.svelte';
  import { getCharacterSheetContext, getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    chosen: ChosenFacilityContext;
  }

  let { chosen }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  function onMouseEnterCraft(event: Event, item: Item5e) {
    TidyHooks.tidy5eSheetsItemHoverOn(event, item);
  }

  function onMouseLeaveCraft(event: Event, item: Item5e) {
    TidyHooks.tidy5eSheetsItemHoverOff(event, item);
  }

  async function editCraftingItem(itemUuid: string) {
    const item = await fromUuidSync(itemUuid);
    item.sheet.render(true);
  }
</script>

{#if chosen.progress.max || chosen.executing}
  <div class="sub-header">
    {localize('DND5E.FACILITY.FIELDS.order.label')}
  </div>
  <div class="craft-and-meter">
    {#if chosen.craft}
      <a
        onclick={() => context.editable && editCraftingItem(chosen.craft.uuid)}
        data-info-card={'item'}
        data-info-card-entity-uuid={chosen.craft.uuid}
      >
        <img
          class="crafting-item"
          data-uuid={chosen.craft.uuid}
          onmouseenter={(ev) => onMouseEnterCraft(ev, chosen.craft)}
          onmouseleave={(ev) => onMouseLeaveCraft(ev, chosen.craft)}
          src={chosen.craft.img}
          alt={chosen.craft.name}
        />
      </a>
    {/if}

    <FacilityOrderProgressMeterQuadrone {chosen}></FacilityOrderProgressMeterQuadrone>
  </div>
{/if}
