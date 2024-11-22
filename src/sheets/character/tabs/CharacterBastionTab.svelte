<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    CharacterSheetContext,
    ChosenFacilityContext,
    ItemCardStore,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable, Writable } from 'svelte/store';
  import FacilityOccupant from 'src/sheets/character/parts/FacilityOccupant.svelte';
  import FacilityRosterOccupant from 'src/sheets/character/parts/FacilityRosterOccupant.svelte';
  import FacilityOrderProgressTracker from '../parts/FacilityOrderProgressTracker.svelte';
  import SheetEditor from 'src/components/editor/SheetEditor.svelte';
  import RerenderAfterFormSubmission from 'src/components/utility/RerenderAfterFormSubmission.svelte';
  import { EventHelper } from 'src/utils/events';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import { settingStore } from 'src/settings/settings';
  import DefaultItemCardContentTemplate from 'src/components/item-info-card/DefaultItemCardContentTemplate.svelte';
  import InventoryItemCardContent from 'src/components/item-info-card/InventoryItemCardContent.svelte';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: hasDefenders = $context.facilities.special.chosen.some(
    (c: ChosenFacilityContext) => c.defenders.some((d) => !d.empty),
  );

  $: hasHirelings = $context.facilities.special.chosen.some(
    (c: ChosenFacilityContext) => c.hirelings.some((d) => !d.empty),
  );

  $: hasCreatures = $context.facilities.special.chosen.some(
    (c: ChosenFacilityContext) => c.creatures.some((d) => !d.empty),
  );

  let card: Writable<ItemCardStore> | undefined = getContext<
    Writable<ItemCardStore>
  >(CONSTANTS.SVELTE_CONTEXT.CARD);

  async function onMouseEnterCraft(event: Event, itemUuid: string) {
    const item = await fromUuid(itemUuid);
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

  async function onMouseLeaveCraft(event: Event, itemUuid: string) {
    const item = await fromUuid(itemUuid);
    TidyHooks.tidy5eSheetsItemHoverOff(event, item);

    card?.update((card) => {
      card.item = null;
      card.itemCardContentTemplate = null;
      return card;
    });
  }

  async function addFacility(type: string) {
    const otherType =
      type === CONSTANTS.FACILITY_TYPE_BASIC
        ? CONSTANTS.FACILITY_TYPE_SPECIAL
        : CONSTANTS.FACILITY_TYPE_BASIC;
    const result = await dnd5e.applications.CompendiumBrowser.selectOne({
      filters: {
        locked: {
          types: new Set(['facility']),
          additional: {
            type: { [type]: 1, [otherType]: -1 },
            level: { max: $context.actor.system.details.level },
          },
        },
      },
    });

    if (result) {
      $context.actor.sheet._onDropItemCreate(await fromUuid(result));
    }
  }

  function editFacility(chosen: ChosenFacilityContext) {
    const facility = $context.actor.items.get(chosen.id);
    return facility?.sheet.render(true);
  }

  function useFacility(event: MouseEvent, chosen: ChosenFacilityContext) {
    const facility = $context.actor.items.get(chosen.id);
    return facility?.use({ legacy: false, chooseActivity: true, event });
  }

  async function editCraftingItem(itemUuid: string) {
    const item = await fromUuidSync(itemUuid);
    item.sheet.render(true);
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="bastion-container scroll-container">
  <section class="name">
    {#if $context.unlocked}
      <TextInput
        document={$context.actor}
        field="system.bastion.name"
        value={$context.system.bastion.name}
        selectOnFocus={true}
        placeholder={localize('DND5E.Bastion.Label')}
      />
    {:else}
      <div class="document-name">{$context.system.bastion.name}</div>
    {/if}
  </section>
  <section class="contents">
    <section class="facilities special">
      <h3>
        <i class="fas fa-building-columns"></i>
        {localize('DND5E.FACILITY.Types.Special.Label.other')}
        <span class="counter">
          <span class="value">{$context.facilities.special.value}</span> /
          <span class="max">{$context.facilities.special.max}</span>
        </span>
      </h3>
      <ul>
        {#each $context.facilities.special.chosen as chosen}
          <li
            class="facility special"
            data-item-id={chosen.id}
            data-facility-id={chosen.id}
            class:disabled={chosen.disabled}
            class:building={chosen.building}
            data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
            style="--underlay: url('{chosen.img}')"
          >
            <div class="facility-header">
              <!-- svelte-ignore a11y-missing-attribute -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <a on:click={() => editFacility(chosen)}>
                <img src={chosen.img} alt={chosen.name} />
              </a>
              <!-- svelte-ignore a11y-missing-attribute -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <a
                class="title-and-subtitle"
                on:click={(ev) => useFacility(ev, chosen)}
              >
                <span class="title"> {chosen.name} </span>
                <span class="subtitle">
                  {@html chosen.subtitle}
                </span>
              </a>
              <!-- svelte-ignore a11y-missing-attribute -->
              <a
                class="facility-menu highlight-on-hover"
                on:click={(ev) =>
                  EventHelper.triggerContextMenu(ev, '[data-item-id]')}
              >
                <i class="fas fa-ellipsis-vertical"></i>
              </a>
            </div>
            {#if chosen.hirelings.length}
              <div class="sub-header">
                {localize('DND5E.FACILITY.FIELDS.hirelings.max.label')}
              </div>
              <div
                class="slots facility-occupants hirelings"
                data-prop="system.hirelings"
              >
                {#each chosen.hirelings as { actor, empty }, index}
                  <FacilityOccupant
                    {actor}
                    {index}
                    type="hireling"
                    iconClass="far fa-user"
                    facilityId={chosen.id}
                    facilityName={chosen.name}
                    prop="system.hirelings"
                  ></FacilityOccupant>
                {/each}
              </div>
            {/if}
            {#if chosen.defenders.length}
              <div class="sub-header">
                {localize('DND5E.FACILITY.FIELDS.defenders.max.label')}
              </div>
              <div
                class="slots facility-occupants defenders"
                data-prop="system.defenders"
              >
                {#each chosen.defenders as { actor, empty }, index}
                  <FacilityOccupant
                    {actor}
                    {index}
                    type="defender"
                    iconClass="far fa-shield"
                    facilityId={chosen.id}
                    facilityName={chosen.name}
                    prop="system.defenders"
                  ></FacilityOccupant>
                {/each}
              </div>
            {/if}
            {#if chosen.creatures.length}
              <div class="sub-header">
                {localize('TIDY5E.Facilities.Creatures.Label')}
              </div>
              <div
                class="slots facility-occupants creatures"
                data-prop="system.trade.creatures"
              >
                {#each chosen.creatures as { actor, empty }, index}
                  <FacilityOccupant
                    {actor}
                    {index}
                    type="creature"
                    iconClass="far fa-horse-head"
                    facilityId={chosen.id}
                    facilityName={chosen.name}
                    prop="system.trade.creatures"
                  ></FacilityOccupant>
                {/each}
              </div>
            {/if}
            <div class="craft-and-progress">
              {#if chosen.craft}
                <a on:click={() => editCraftingItem(chosen.craft.uuid)}>
                  <img
                    class="crafting-item"
                    data-uuid={chosen.craft.uuid}
                    on:mouseenter={(ev) =>
                      onMouseEnterCraft(ev, chosen.craft.uuid)}
                    on:mouseleave={(ev) =>
                      onMouseLeaveCraft(ev, chosen.craft.uuid)}
                    src={chosen.craft.img}
                    alt={chosen.craft.name}
                  />
                </a>
              {/if}
              <div class="progress-container">
                TODO: If crafting item, put item name to right of craft order.
                <FacilityOrderProgressTracker {chosen} />
              </div>
            </div>
          </li>
        {/each}
        {#each $context.facilities.special.available as available}
          <li class="facility empty">
            <!-- svelte-ignore a11y-missing-attribute -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <a
              class="highlight-on-hover"
              on:click={() => addFacility(CONSTANTS.FACILITY_TYPE_SPECIAL)}
            >
              <i class="fas fa-building-columns"></i>
              {localize(available.label)}
            </a>
          </li>
        {/each}
      </ul>
    </section>
    <section class="facilities basic">
      <h3>
        <i class="fas fa-chess-rook"></i>
        {localize('DND5E.FACILITY.Types.Basic.Label.other')}
      </h3>
      <ul>
        {#each $context.facilities.basic.chosen as chosen}
          <li
            class="facility basic"
            data-item-id={chosen.id}
            data-facility-id={chosen.id}
            class:disabled={chosen.disabled}
            class:building={chosen.building}
            data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
            style="--underlay: url('{chosen.img}')"
          >
            <div class="facility-header">
              <!-- svelte-ignore a11y-missing-attribute -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <a on:click={() => editFacility(chosen)}>
                <img src={chosen.img} alt={chosen.name} />
              </a>
              <!-- svelte-ignore a11y-missing-attribute -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <a
                class="title-and-subtitle"
                on:click={(ev) => useFacility(ev, chosen)}
              >
                <span class="title">{chosen.name}</span>
                <span class="subtitle">
                  {@html chosen.subtitle}
                </span>
              </a>
              <!-- svelte-ignore a11y-missing-attribute -->
              <a
                class="facility-menu highlight-on-hover"
                on:click={(ev) =>
                  EventHelper.triggerContextMenu(ev, '[data-item-id]')}
              >
                <i class="fas fa-ellipsis-vertical"></i>
              </a>
            </div>
            <FacilityOrderProgressTracker {chosen} />
          </li>
        {/each}
        {#each $context.facilities.basic.available as available}
          <div class="facility empty">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
              class="highlight-on-hover"
              on:click={() => addFacility(CONSTANTS.FACILITY_TYPE_BASIC)}
            >
              {#if available.label.includes('build')}
                <i class="fa-solid fa-trowel"></i>
              {:else}
                <i class="fas fa-chess-rook"></i>
              {/if}
              {localize(available.label)}
            </a>
          </div>
        {/each}
      </ul>
    </section>
    {#if hasDefenders}
      <section class="roster defenders">
        <h3>
          <i class="fa-solid fa-shield"></i>
          {localize('TIDY5E.Facilities.Defenders.Label')}
        </h3>
        <ul>
          {#each $context.facilities.special.chosen as chosen}
            {#each chosen.defenders as { actor, empty }, index}
              {#if !empty}
                <FacilityRosterOccupant
                  occupant={actor}
                  type="defender"
                  {index}
                  prop="system.defenders"
                  facilityId={chosen.id}
                  facilityName={chosen.name}
                />
              {/if}
            {/each}
          {/each}
        </ul>
      </section>
    {/if}
    {#if hasHirelings}
      <section class="roster hirelings">
        <h3>
          <i class="fa-solid fa-users"></i>
          {localize('TIDY5E.Facilities.Hirelings.Label')}
        </h3>
        <ul>
          {#each $context.facilities.special.chosen as chosen}
            {#each chosen.hirelings as { actor, empty }, index}
              {#if !empty}
                <FacilityRosterOccupant
                  occupant={actor}
                  type="hireling"
                  {index}
                  prop="system.hirelings"
                  facilityId={chosen.id}
                  facilityName={chosen.name}
                />
              {/if}
            {/each}
          {/each}
        </ul>
      </section>
    {/if}
    {#if hasCreatures}
      <section class="roster creatures">
        <h3>
          <i class="fa-solid fa-horse-head"></i>
          {localize('TIDY5E.Facilities.Creatures.Label')}
        </h3>
        <ul>
          {#each $context.facilities.special.chosen as chosen}
            {#each chosen.creatures as { actor, empty }, index}
              {#if !empty}
                <FacilityRosterOccupant
                  occupant={actor}
                  type="creature"
                  {index}
                  prop="system.trade.creatures"
                  facilityId={chosen.id}
                  facilityName={chosen.name}
                />
              {/if}
            {/each}
          {/each}
        </ul>
      </section>
    {/if}
  </section>
  <RerenderAfterFormSubmission
    andOnValueChange={$context.bastion.description ?? ''}
  >
    <section class="description" use:$context.activateEditors>
      <h3><i class="fa-solid fa-books"></i> Description</h3>
      <SheetEditor
        content={$context.bastion.description}
        target="system.bastion.description"
        editable={$context.editable}
      />
    </section>
  </RerenderAfterFormSubmission>
</div>
