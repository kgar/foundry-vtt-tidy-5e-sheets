<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ChosenFacilityContext } from 'src/types/types';
  import { setContext } from 'svelte';
  import FacilityOccupant from 'src/sheets/classic/character/parts/FacilityOccupant.svelte';
  import FacilityRosterOccupant from 'src/sheets/classic/character/parts/FacilityRosterOccupant.svelte';
  import FacilityOrderProgressTracker from '../parts/FacilityOrderProgressTracker.svelte';
  import RerenderAfterFormSubmission from 'src/components/utility/RerenderAfterFormSubmission.svelte';
  import { EventHelper } from 'src/utils/events';
  import { isNil } from 'src/utils/data';
  import type { Item5e } from 'src/types/item.types';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import { applyDropzoneClass } from 'src/features/drag-and-drop/drag-and-drop';
  import InlineSvg from 'src/components/utility/InlineSvg.svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';

  let context = $derived(getCharacterSheetContext());

  function onMouseEnterFacility(event: Event, item: Item5e) {
    TidyHooks.tidy5eSheetsItemHoverOn(event, item);
  }

  function onMouseLeaveFacility(event: Event, item: Item5e) {
    TidyHooks.tidy5eSheetsItemHoverOff(event, item);
  }

  let hoveredFacilityOccupant = $state<Ref<string>>({
    value: '',
  });

  setContext<Ref<string>>(
    CONSTANTS.SVELTE_CONTEXT.HOVERED_FACILITY_OCCUPANT,
    hoveredFacilityOccupant,
  );

  let hasDefenders = $derived(
    context.facilities.special.chosen.some((c: ChosenFacilityContext) =>
      c.defenders.some((d) => !!d.uuid),
    ),
  );

  let hasHirelings = $derived(
    context.facilities.special.chosen.some((c: ChosenFacilityContext) =>
      c.hirelings.some((d) => !!d.uuid),
    ),
  );

  let hasCreatures = $derived(
    context.facilities.special.chosen.some((c: ChosenFacilityContext) =>
      c.creatures.some((d) => !!d.uuid),
    ),
  );

  // TODO: Extract and share between this and advancements
  const basicSvgFilePathRegex = /\.svg$/i;

  function isSvg(iconPath: string) {
    return basicSvgFilePathRegex.test(iconPath?.trim());
  }

  async function addFacility(ev: Event, type: string) {
    if (!TidyHooks.tidy5eSheetsAddFacilityClicked(ev, context.actor, type)) {
      return;
    }

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
            level: { max: context.actor.system.details.level },
          },
        },
      },
    });

    if (result) {
      context.actor.sheet._onDropItemCreate(await fromUuid(result));
    }
  }

  function useFacility(event: MouseEvent, chosen: ChosenFacilityContext) {
    const facility = context.actor.items.get(chosen.id);
    return facility?.use({ legacy: false, chooseActivity: true, event });
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="bastion-container scroll-container">
  <!-- Name -->

  <section class="name">
    {#if context.unlocked}
      <TextInput
        document={context.actor}
        field="system.bastion.name"
        value={context.system.bastion.name}
        selectOnFocus={true}
        placeholder={localize('DND5E.Bastion.Label')}
      />
    {:else if !isNil(context.system.bastion.name, '')}
      <div class="document-name">{context.system.bastion.name}</div>
    {/if}
  </section>

  <!-- Facilities -->

  <section class="facility-panels">
    <!-- Special Facilities -->

    <section class="facilities special">
      <h3>
        <i class="fas fa-building-columns"></i>
        {localize('DND5E.FACILITY.Types.Special.Label.other')}
        <span class="counter">
          <span class="value">{context.facilities.special.value}</span> /
          <span class="max">{context.facilities.special.max}</span>
        </span>
      </h3>
      <ul class="facility-list">
        {#each context.facilities.special.chosen as chosen}
          {@const bgImg = chosen.img.includes(
            'systems/dnd5e/icons/svg/items/facility.svg',
          )
            ? '../../modules/tidy5e-sheet/images/facility-default-background.webp'
            : chosen.img}

          {@const img = !chosen.disabled
            ? chosen.img
            : context.config.facilities.orders.repair.icon}

          <li
            class="facility special"
            data-item-id={chosen.id}
            data-facility-id={chosen.id}
            class:disabled={chosen.disabled}
            class:no-events={chosen.disabled && !FoundryAdapter.userIsGm()}
            class:building={chosen.building}
            data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
            style="--underlay: url('{bgImg}')"
            data-info-card={'item'}
            data-info-card-entity-uuid={chosen.facility.uuid}
          >
            <div class="facility-header">
              <a
                class="facility-header-details"
                onmouseenter={(ev) => onMouseEnterFacility(ev, chosen.facility)}
                onmouseleave={(ev) => onMouseLeaveFacility(ev, chosen.facility)}
                onmousedown={(ev) =>
                  FoundryAdapter.editOnMiddleClick(ev, chosen.facility)}
                onclick={(ev) => context.editable && useFacility(ev, chosen)}
              >
                <!-- <img class="facility-image" src={img} alt={chosen.name} /> -->

                {#if isSvg(img)}
                  <InlineSvg class="facility-image" svgUrl={img} />
                {:else}
                  <img class="facility-image" src={img} alt={chosen.name} />
                {/if}

                <div class="title-and-subtitle">
                  <span class="title"> {chosen.name} </span>
                  <span class="subtitle">
                    {@html chosen.subtitle}
                  </span>
                </div>
              </a>
              <a
                class="facility-menu highlight-on-hover"
                onclick={(ev) =>
                  EventHelper.triggerContextMenu(ev, '[data-item-id]')}
              >
                <i class="fas fa-ellipsis-vertical"></i>
              </a>
            </div>

            {#if chosen.hirelings.length}
              <div
                class="facility-occupants"
                data-prop="system.hirelings"
                use:applyDropzoneClass={'occupant-dropzone'}
              >
                <div class="sub-header">
                  {localize('DND5E.FACILITY.FIELDS.hirelings.max.label')}
                </div>
                <ul class="slots hirelings">
                  {#each chosen.hirelings as { actor, uuid }, index}
                    <FacilityOccupant
                      occupant={actor}
                      {index}
                      type="hireling"
                      iconClass="far fa-user"
                      facilityId={chosen.id}
                      facilityName={chosen.name}
                      prop="system.hirelings"
                      {uuid}
                    ></FacilityOccupant>
                  {/each}
                </ul>
              </div>
            {/if}
            {#if chosen.defenders.length}
              <div
                class="facility-occupants"
                data-prop="system.defenders"
                use:applyDropzoneClass={'occupant-dropzone'}
              >
                <div class="sub-header">
                  {localize('DND5E.FACILITY.FIELDS.defenders.max.label')}
                </div>
                <ul class="slots facility-occupants defenders">
                  {#each chosen.defenders as { actor, uuid }, index}
                    <FacilityOccupant
                      occupant={actor}
                      {index}
                      type="defender"
                      iconClass="far fa-shield"
                      facilityId={chosen.id}
                      facilityName={chosen.name}
                      prop="system.defenders"
                      {uuid}
                    ></FacilityOccupant>
                  {/each}
                </ul>
              </div>
            {/if}
            {#if chosen.creatures.length}
              <div
                class="facility-occupants"
                data-prop="system.trade.creatures"
                use:applyDropzoneClass={'occupant-dropzone'}
              >
                <div class="sub-header">
                  {localize('TIDY5E.Facilities.Creatures.Label')}
                </div>
                <ul class="slots creatures">
                  {#each chosen.creatures as { actor, uuid }, index}
                    <FacilityOccupant
                      occupant={actor}
                      {index}
                      type="creature"
                      iconClass="far fa-horse-head"
                      facilityId={chosen.id}
                      facilityName={chosen.name}
                      prop="system.trade.creatures"
                      {uuid}
                    ></FacilityOccupant>
                  {/each}
                </ul>
              </div>
            {/if}

            <FacilityOrderProgressTracker {chosen} />
          </li>
        {/each}
        {#each context.facilities.special.available as available}
          <li class="facility empty">
            <a
              class="highlight-on-hover"
              onclick={(ev) =>
                context.editable &&
                addFacility(ev, CONSTANTS.FACILITY_TYPE_SPECIAL)}
            >
              <i class="fas fa-building-columns"></i>
              {localize(available.label)}
            </a>
          </li>
        {/each}
      </ul>
    </section>

    <!-- Basic Facilities -->

    <section class="facilities basic">
      <h3>
        <i class="fas fa-chess-rook"></i>
        {localize('DND5E.FACILITY.Types.Basic.Label.other')}
      </h3>
      <ul class="facility-list">
        {#each context.facilities.basic.chosen as chosen}
          {@const bgImg = chosen.img.includes(
            'systems/dnd5e/icons/svg/items/facility.svg',
          )
            ? '../../modules/tidy5e-sheet/images/facility-default-background.webp'
            : chosen.img}

          {@const img = !chosen.disabled
            ? chosen.img
            : context.config.facilities.orders.repair.icon}

          <li
            class="facility basic"
            data-item-id={chosen.id}
            data-facility-id={chosen.id}
            class:disabled={chosen.disabled}
            class:no-events={chosen.disabled && !FoundryAdapter.userIsGm()}
            class:building={chosen.building}
            data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
            style="--underlay: url('{bgImg}')"
            data-info-card={'item'}
            data-info-card-entity-uuid={chosen.facility.uuid}
          >
            <div class="facility-header">
              <a
                class="facility-header-details"
                onmouseenter={(ev) => onMouseEnterFacility(ev, chosen.facility)}
                onmouseleave={(ev) => onMouseLeaveFacility(ev, chosen.facility)}
                onmousedown={(ev) =>
                  FoundryAdapter.editOnMiddleClick(ev, chosen.facility)}
                onclick={(ev) => context.editable && useFacility(ev, chosen)}
              >
                {#if isSvg(img)}
                  <InlineSvg class="facility-image" svgUrl={img} />
                {:else}
                  <img class="facility-image" src={img} alt={chosen.name} />
                {/if}

                <div class="title-and-subtitle">
                  <span class="title">{chosen.name}</span>
                  <span class="subtitle">
                    {@html chosen.subtitle}
                  </span>
                </div>
              </a>
              <a
                class="facility-menu highlight-on-hover"
                onclick={(ev) =>
                  EventHelper.triggerContextMenu(ev, '[data-item-id]')}
              >
                <i class="fas fa-ellipsis-vertical"></i>
              </a>
            </div>

            <FacilityOrderProgressTracker {chosen} />
          </li>
        {/each}
        {#each context.facilities.basic.available as available}
          <div class="facility empty">
            <a
              class="highlight-on-hover"
              onclick={(ev) =>
                context.editable &&
                addFacility(ev, CONSTANTS.FACILITY_TYPE_BASIC)}
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
  </section>

  <!-- Defender Roster -->

  {#if hasDefenders}
    <section class="roster defenders">
      <h3>
        <i class="fa-solid fa-shield"></i>
        {localize('TIDY5E.Facilities.Defenders.Label')}
      </h3>
      <ul class="roster-list">
        {#each context.facilities.special.chosen as chosen}
          {#each chosen.defenders as { actor, uuid }, index}
            {#if uuid}
              <FacilityRosterOccupant
                occupant={actor}
                type="defender"
                {index}
                prop="system.defenders"
                facilityId={chosen.id}
                facilityName={chosen.name}
                {uuid}
              />
            {/if}
          {/each}
        {/each}
      </ul>
    </section>
  {/if}

  <!-- Hireling Roster -->

  {#if hasHirelings}
    <section class="roster hirelings">
      <h3>
        <i class="fa-solid fa-users"></i>
        {localize('TIDY5E.Facilities.Hirelings.Label')}
      </h3>
      <ul class="roster-list">
        {#each context.facilities.special.chosen as chosen}
          {#each chosen.hirelings as { actor, uuid }, index}
            {#if uuid}
              <FacilityRosterOccupant
                occupant={actor}
                type="hireling"
                {index}
                prop="system.hirelings"
                facilityId={chosen.id}
                facilityName={chosen.name}
                {uuid}
              />
            {/if}
          {/each}
        {/each}
      </ul>
    </section>
  {/if}

  <!-- Creatures Roster -->

  {#if hasCreatures}
    <section class="roster creatures">
      <h3>
        <i class="fa-solid fa-horse-head"></i>
        {localize('TIDY5E.Facilities.Creatures.Label')}
      </h3>
      <ul class="roster-list">
        {#each context.facilities.special.chosen as chosen}
          {#each chosen.creatures as { actor, uuid }, index}
            {#if uuid}
              <FacilityRosterOccupant
                occupant={actor}
                type="creature"
                {index}
                prop="system.trade.creatures"
                facilityId={chosen.id}
                facilityName={chosen.name}
                {uuid}
              />
            {/if}
          {/each}
        {/each}
      </ul>
    </section>
  {/if}

  <!-- Description -->

  <RerenderAfterFormSubmission
    andOnValueChange={context.bastion.description ?? ''}
  >
    <section class="description" use:context.activateEditors>
      <h3><i class="fa-solid fa-books"></i> Description</h3>
      <SheetEditorV2
        enriched={context.bastion.description}
        content={context.system.bastion.description}
        field="system.bastion.description"
        editorOptions={{
          editable: context.editable,
        }}
        documentUuid={context.actor.uuid}
        onSave={() => context.actor.sheet.submit()}
        manageSecrets={context.actor.isOwner}
      />
    </section>
  </RerenderAfterFormSubmission>
</div>
