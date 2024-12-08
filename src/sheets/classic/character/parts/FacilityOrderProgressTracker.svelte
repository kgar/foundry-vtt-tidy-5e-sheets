<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    CharacterSheetContext,
    ChosenFacilityContext,
    ItemCardStore,
  } from 'src/types/types';
  import type { Readable, Writable } from 'svelte/store';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import { settingStore } from 'src/settings/settings';
  import InventoryItemCardContent from 'src/components/item-info-card/InventoryItemCardContent.svelte';
  import type { Item5e } from 'src/types/item.types';
  import FacilityOrderProgressMeter from './FacilityOrderProgressMeter.svelte';

  export let chosen: ChosenFacilityContext;

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;

  let card: Writable<ItemCardStore> | undefined = getContext<
    Writable<ItemCardStore>
  >(CONSTANTS.SVELTE_CONTEXT.CARD);

  function onMouseEnterCraft(event: Event, item: Item5e) {
    TidyHooks.tidy5eSheetsItemHoverOn(event, item);

    if (!item?.getChatData || !$settingStore.itemCardsForAllItems) {
      return;
    }

    card?.update((card) => {
      card.item = item;
      card.itemCardContentTemplate = InventoryItemCardContent;
      return card;
    });
  }

  function onMouseLeaveCraft(event: Event, item: Item5e) {
    TidyHooks.tidy5eSheetsItemHoverOff(event, item);

    card?.update((card) => {
      card.item = null;
      card.itemCardContentTemplate = null;
      return card;
    });
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
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        on:click={() =>
          $context.editable && editCraftingItem(chosen.craft.uuid)}
      >
        <img
          class="crafting-item"
          data-uuid={chosen.craft.uuid}
          on:mouseenter={(ev) => onMouseEnterCraft(ev, chosen.craft)}
          on:mouseleave={(ev) => onMouseLeaveCraft(ev, chosen.craft)}
          src={chosen.craft.img}
          alt={chosen.craft.name}
        />
      </a>
    {/if}

    <FacilityOrderProgressMeter
      {chosen}
    ></FacilityOrderProgressMeter>
  </div>
{/if}
