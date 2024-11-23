<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CharacterSheetRuntime } from 'src/runtime/CharacterSheetRuntime';
  import type {
    CharacterSheetContext,
    ChosenFacilityContext,
    ItemCardStore,
  } from 'src/types/types';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import type { Readable, Writable } from 'svelte/store';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import { settingStore } from 'src/settings/settings';
  import InventoryItemCardContent from 'src/components/item-info-card/InventoryItemCardContent.svelte';
  import type { Item5e } from 'src/types/item.types';

  export let chosen: ChosenFacilityContext;

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: orderLabel =
    CONFIG.DND5E.facilities.orders[chosen.progress.order]?.label ??
    chosen.progress.order;

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
  {@const icon = CharacterSheetRuntime.getTidyFacilityIcon(
    chosen.progress.order,
  )}

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

    <div
      class="meter progress"
      role="meter"
      aria-valuemin="0"
      aria-valuenow={chosen.progress.pct}
      aria-valuetext={chosen.progress.value?.toString()}
      aria-valuemax={chosen.progress.max}
      style="--bar-percentage: {chosen.progress.pct}%"
    >
      <div class="label">
        <span class="order">
          {#if icon?.type === 'fa-icon-class'}
            <i class={icon.className}></i>
          {:else if icon?.type === 'dnd5e-icon'}
            <Dnd5eIcon src={icon.src}></Dnd5eIcon>
          {/if}
          <span class="progress-meter-label truncate">
            {#if chosen.craft}
              {localize('TIDY5E.Facilities.Progress.OrderAndCraftLabel', {
                orderName: orderLabel,
                craftingItemName: chosen.craft.name,
              })}
            {:else}
              {orderLabel}
            {/if}
          </span>
        </span>
        <span class="counter">
          <span class="value">{chosen.progress.value}</span> &sol;
          <span class="max">{chosen.progress.max}</span>
        </span>
      </div>
    </div>
  </div>
{/if}
