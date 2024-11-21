<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    CharacterSheetContext,
    ChosenFacilityContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import FacilityOccupant from 'src/sheets/character/parts/FacilityOccupant.svelte';
  import FacilityRosterOccupant from 'src/sheets/character/parts/FacilityRosterOccupant.svelte';
  import FacilityOrderProgressTracker from '../parts/FacilityOrderProgressTracker.svelte';
  import SheetEditor from 'src/components/editor/SheetEditor.svelte';
  import RerenderAfterFormSubmission from 'src/components/utility/RerenderAfterFormSubmission.svelte';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: allDefenders = $context.facilities.special.chosen
    .flatMap((x) => x.defenders)
    .filter((x) => !x.empty)
    .map((x) => x.actor);
  $: allHirelings = $context.facilities.special.chosen
    .flatMap((x) => x.hirelings)
    .filter((x) => !x.empty)
    .map((x) => x.actor);
  $: allCreatures = $context.facilities.special.chosen
    .flatMap((x) => x.creatures)
    .filter((x) => !x.empty)
    .map((x) => x.actor);

  function getOrderLabel(order: string) {
    return CONFIG.DND5E.facilities.orders[order]?.label ?? order;
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
              <a class="facility-menu highlight-on-hover">
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
                  ></FacilityOccupant>
                {/each}
              </div>
            {/if}
            <FacilityOrderProgressTracker {chosen} />
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
              <a class="facility-menu highlight-on-hover">
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
    {#if allDefenders.length}
      <section class="roster defenders">
        <h3>
          <i class="fa-solid fa-shield"></i>
          {localize('TIDY5E.Facilities.Defenders.Label')}
        </h3>
        <ul>
          {#each allDefenders as defender, index}
            <FacilityRosterOccupant
              occupant={defender}
              type="defender"
              {index}
              prop="system.defenders"
            />
          {/each}
        </ul>
      </section>
    {/if}
    {#if allHirelings.length}
      <section class="roster hirelings">
        <h3>
          <i class="fa-solid fa-users"></i>
          {localize('TIDY5E.Facilities.Hirelings.Label')}
        </h3>
        <ul>
          {#each allHirelings as hireling, index}
            <FacilityRosterOccupant
              occupant={hireling}
              type="defender"
              {index}
              prop="system.hirelings"
            />
          {/each}
        </ul>
      </section>
    {/if}
    {#if allCreatures.length}
      <section class="roster creatures">
        <h3>
          <i class="fa-solid fa-horse-head"></i>
          {localize('TIDY5E.Facilities.Creatures.Label')}
        </h3>
        <ul>
          {#each allCreatures as creature, index}
            <FacilityRosterOccupant
              occupant={creature}
              type="creature"
              {index}
              prop="system.trade.creatures"
            />
          {/each}
        </ul>
      </section>
    {/if}
  </section>
  <!-- 
    TODO:
    - Singleton editor UI that flexes the whole height of the screen, except for Bastion name.
   -->
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
