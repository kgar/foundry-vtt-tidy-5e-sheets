<script lang="ts">
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ChosenFacilityContext } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { setContext } from 'svelte';
  import FacilityOrderProgressTrackerQuadrone from '../character-parts/bastion/FacilityOrderProgressTrackerQuadrone.svelte';
  import FacilityOccupantQuadrone from '../character-parts/bastion/FacilityOccupantQuadrone.svelte';
  import { applyDropzoneClass } from 'src/features/drag-and-drop/drag-and-drop';
  import InlineSvg from 'src/components/utility/InlineSvg.svelte';
  import type { Item5e } from 'src/types/item.types';
  import { EventHelper } from 'src/utils/events';

  let context = $derived(getCharacterSheetQuadroneContext());

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
      context.actor.sheet._onDropItemCreate(await fromUuid(result), ev, 'copy');
    }
  }

  function useFacility(event: MouseEvent, chosen: ChosenFacilityContext) {
    const facility = context.actor.items.get(chosen.id);
    return facility?.use({ legacy: false, chooseActivity: true, event });
  }

  let localize = FoundryAdapter.localize;
</script>

<section class="name">
  {#if context.unlocked}
    <TextInputQuadrone
      document={context.actor}
      field="system.bastion.name"
      value={context.system.bastion.name}
      selectOnFocus={true}
      placeholder={localize('DND5E.Bastion.Label')}
    />
  {:else if !isNil(context.system.bastion.name, '')}
    {context.system.bastion.name}
  {/if}
</section>

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
                  <FacilityOccupantQuadrone
                    occupant={actor}
                    {index}
                    type="hireling"
                    iconClass="far fa-user"
                    facilityId={chosen.id}
                    facilityName={chosen.name}
                    prop="system.hirelings"
                    {uuid}
                  ></FacilityOccupantQuadrone>
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
                  <FacilityOccupantQuadrone
                    occupant={actor}
                    {index}
                    type="defender"
                    iconClass="far fa-shield"
                    facilityId={chosen.id}
                    facilityName={chosen.name}
                    prop="system.defenders"
                    {uuid}
                  ></FacilityOccupantQuadrone>
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
                  <FacilityOccupantQuadrone
                    occupant={actor}
                    {index}
                    type="creature"
                    iconClass="far fa-horse-head"
                    facilityId={chosen.id}
                    facilityName={chosen.name}
                    prop="system.trade.creatures"
                    {uuid}
                  ></FacilityOccupantQuadrone>
                {/each}
              </ul>
            </div>
          {/if}

          <FacilityOrderProgressTrackerQuadrone {chosen} />
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

  <section class="facilities basic"></section>
</section>

<!-- Defender Roster -->

{#if hasDefenders}
  <section class="roster defenders"></section>
{/if}

{#if hasHirelings}
  <section class="roster hirelings"></section>
{/if}

{#if hasCreatures}
  <section class="roster creatures"></section>
{/if}

<section class="description">
  <h3><i class="fa-solid fa-books"></i> Description</h3>

  {#key context.bastion.description}
    {#if context.unlocked}
      <SheetEditorV2
        documentUuid={context.document.uuid}
        content={context.actor.system.bastion.description}
        editorOptions={{ toggled: false }}
        manageSecrets={true}
        field="system.bastion.description"
        enriched={context.bastion.description}
      ></SheetEditorV2>
    {:else}
      <div class="editor" use:manageSecrets={{ document: context.document }}>
        <div data-field="system.bastion.description" class="user-select-text">
          {@html context.bastion.description}
        </div>
      </div>
    {/if}
  {/key}
</section>
