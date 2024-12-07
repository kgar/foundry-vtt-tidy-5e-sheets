<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ChosenFacilityContext } from 'src/types/types';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import type { Item5e } from 'src/types/item.types';
  import FacilityOrderProgressMeter from './FacilityOrderProgressMeter.svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    chosen: ChosenFacilityContext;
  }

  let { chosen }: Props = $props();

  let context = getCharacterSheetContext();

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
  <!-- TODO: When svelte 5, snippets? -->
  <div class="craft-and-meter">
    {#if chosen.craft}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <!-- svelte-ignore a11y_missing_attribute -->
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

    <FacilityOrderProgressMeter {chosen}></FacilityOrderProgressMeter>
  </div>
{/if}
