<script lang="ts">
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
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
  import { dropzoneClass } from 'src/features/drag-and-drop/drag-and-drop';
  import InlineSvg from 'src/components/utility/InlineSvg.svelte';
  import type { Item5e } from 'src/types/item.types';
  import FacilityRosterOccupantQuadrone from '../character-parts/bastion/FacilityRosterOccupantQuadrone.svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';

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
    context.facilities.special.builtFacilities.some((c: ChosenFacilityContext) =>
      c.defenders.some((d) => !!d.uuid),
    ),
  );

  let hasHirelings = $derived(
    context.facilities.special.builtFacilities.some((c: ChosenFacilityContext) =>
      c.hirelings.some((d) => !!d.uuid),
    ),
  );

  let hasCreatures = $derived(
    context.facilities.special.builtFacilities.some((c: ChosenFacilityContext) =>
      c.creatures.some((d) => !!d.uuid),
    ),
  );

  // TODO: Extract and share between this and advancements
  const basicSvgFilePathRegex = /\.svg$/i;

  function isSvg(iconPath: string) {
    return basicSvgFilePathRegex.test(iconPath?.trim());
  }

  let localize = FoundryAdapter.localize;

  let editing = $state(false);

  async function stopEditing() {
    editing = false;
  }
</script>

<div class="tab-content">
  {#if editing}
    {#key context.actor.system.bastion.description}
      <article class="flexible-editor-container singleton">
        <SheetEditorV2
          enriched={context.enriched.bastion}
          content={context.actor.system.bastion.description}
          field="system.bastion.description"
          editorOptions={{
            editable: context.editable,
            toggled: false,
          }}
          documentUuid={context.actor.uuid}
          onSave={() => stopEditing()}
        />
      </article>
    {/key}
  {:else}
    {#if context.unlocked}
      <section class="name">
        <input
          type="text"
          data-name="system.bastion.name"
          class="font-title-medium h2"
          value={context.system.bastion.name}
          placeholder={localize('DND5E.Bastion.Label')}
          {@attach InputAttachments.selectOnFocus}
        />
      </section>
    {:else if !isNil(context.system.bastion.name, '')}
      <section class="name">
        <h2 class="bastion-name font-title-medium">
          {context.system.bastion.name}
        </h2>
      </section>
    {/if}

    <section class="facility-panels">
      <!-- Special Facilities -->

      <section class="facilities special">
        <div class="bastion-header">
          <h3 class="font-title-small">
            <i class="fa-solid fa-building-columns"></i>
            {localize('DND5E.FACILITY.Types.Special.Label.other')}
            <span class="counter">
              <span
                class="value {context.facilities.special.count > 0
                  ? 'color-text-default'
                  : 'color-text-lightest'} font-label-medium"
                >{context.facilities.special.count}</span
              >
              <span class="divider color-text-gold font-default-medium">/</span>
              <span class="max color-text-default font-label-medium"
                >{context.facilities.special.max}</span
              >
            </span>
          </h3>
          <tidy-gold-header-underline></tidy-gold-header-underline>
        </div>
        <ul class="facility-list unlist">
          {#each context.facilities.special.builtFacilities as chosen}
            {const bgImg = $derived(
              chosen.img.includes('systems/dnd5e/icons/svg/items/facility.svg')
                ? '../../modules/tidy5e-sheet/images/facility-default-background.webp'
                : chosen.img,
            )}

            {const img = $derived(
              !chosen.disabled
                ? chosen.img
                : context.config.facilities.orders.repair.icon,
            )}

            <li
              class={[
                'facility',
                'special',
                {
                  disabled: chosen.disabled,
                  ['no-events']: chosen.disabled && !FoundryAdapter.userIsGm(),
                  building: chosen.building,
                },
              ]}
              data-tidy-draggable
              data-item-id={chosen.id}
              data-facility-id={chosen.id}
              data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
              style="--underlay: url('{bgImg}')"
            >
              <div class="facility-header">
                <!-- svelte-ignore a11y_missing_attribute -->
                <a
                  class="facility-header-details"
                  onmouseenter={(ev) =>
                    onMouseEnterFacility(ev, chosen.facility)}
                  onmouseleave={(ev) =>
                    onMouseLeaveFacility(ev, chosen.facility)}
                  data-action={context.editable ? 'useFacility' : undefined}
                  {@attach InputAttachments.triggerClickOnKeydown}
                  role="button"
                  data-keyboard-focus
                  tabindex="0"
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
                <!-- svelte-ignore a11y_missing_attribute -->
                <a
                  class="facility-menu highlight-on-hover"
                  data-action="showContextMenu"
                  data-target-selector="[data-item-id]"
                  {@attach InputAttachments.triggerClickOnKeydown}
                  role="button"
                  data-keyboard-focus
                  tabindex="0"
                >
                  <i class="fas fa-ellipsis-vertical"></i>
                </a>
              </div>

              {#if chosen.hirelings.length}
                <div
                  class="facility-occupants"
                  data-prop="system.hirelings"
                  data-facility-type="hireling"
                >
                  <div class="sub-header font-label-medium color-text-lighter">
                    {localize('DND5E.FACILITY.FIELDS.hirelings.max.label')}
                  </div>
                  <ul class="slots hirelings unlist">
                    {#each chosen.hirelings as { actor, uuid }, index}
                      <FacilityOccupantQuadrone
                        occupant={actor}
                        {index}
                        type="hireling"
                        iconClass="far fa-user"
                        facilityId={chosen.id}
                        facilityName={chosen.name}
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
                  data-facility-type="defender"
                >
                  <div class="sub-header font-label-medium color-text-lighter">
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
                  data-facility-type="creature"
                  {@attach dropzoneClass('occupant-dropzone')}
                >
                  <div class="sub-header font-label-medium color-text-lighter">
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
              <!-- svelte-ignore a11y_missing_attribute -->
              <a
                class="button button-tertiary"
                data-action="findItem"
                data-item-type={CONSTANTS.ITEM_TYPE_FACILITY}
                data-facility-type={CONSTANTS.FACILITY_TYPE_SPECIAL}
                {@attach InputAttachments.triggerClickOnKeydown}
                role="button"
                data-keyboard-focus
                tabindex="0"
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
        <div class="bastion-header">
          <h3 class="font-title-small">
            <i class="fa-solid fa-house-turret"></i>
            {localize('DND5E.FACILITY.Types.Basic.Label.other')}
            <span class="counter">
              <span
                class="value {context.facilities.basic.count > 0
                  ? 'color-text-default'
                  : 'color-text-lightest'} font-label-medium"
                >{context.facilities.basic.count}</span
              >
              <span class="divider color-text-gold font-default-medium">/</span>
              <span class="max color-text-default font-label-medium"
                >{context.facilities.basic.max}</span
              >
            </span>
          </h3>
          <tidy-gold-header-underline></tidy-gold-header-underline>
        </div>

        <ul class="facility-list unlist">
          {#each context.facilities.basic.builtFacilities as chosen}
            {const bgImg = $derived(
              chosen.img.includes('systems/dnd5e/icons/svg/items/facility.svg')
                ? '../../modules/tidy5e-sheet/images/facility-default-background.webp'
                : chosen.img,
            )}

            {const img = $derived(
              !chosen.disabled
                ? chosen.img
                : context.config.facilities.orders.repair.icon,
            )}

            <li
              class="facility basic"
              data-item-id={chosen.id}
              data-facility-id={chosen.id}
              class:disabled={chosen.disabled}
              class:no-events={chosen.disabled && !FoundryAdapter.userIsGm()}
              class:building={chosen.building}
              data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
              style="--underlay: url('{bgImg}')"
            >
              <div class="facility-header">
                <!-- svelte-ignore a11y_missing_attribute -->
                <a
                  class="facility-header-details"
                  onmouseenter={(ev) =>
                    onMouseEnterFacility(ev, chosen.facility)}
                  onmouseleave={(ev) =>
                    onMouseLeaveFacility(ev, chosen.facility)}
                  data-action={context.editable ? 'useFacility' : undefined}
                  {@attach InputAttachments.triggerClickOnKeydown}
                  role="button"
                  data-keyboard-focus
                  tabindex="0"
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
                <!-- svelte-ignore a11y_missing_attribute -->
                <a
                  class="facility-menu highlight-on-hover"
                  data-action="showContextMenu"
                  data-target-selector="[data-item-id]"
                  {@attach InputAttachments.triggerClickOnKeydown}
                  role="button"
                  data-keyboard-focus
                  tabindex="0"
                >
                  <i class="fas fa-ellipsis-vertical"></i>
                </a>
              </div>

              <FacilityOrderProgressTrackerQuadrone {chosen} />
            </li>
          {/each}
          {#each context.facilities.basic.available as available}
            <div class="facility empty">
              <!-- svelte-ignore a11y_missing_attribute -->
              <a
                class="button button-tertiary"
                {@attach InputAttachments.triggerClickOnKeydown}
                data-action="findItem"
                data-item-type={CONSTANTS.ITEM_TYPE_FACILITY}
                data-facility-type={CONSTANTS.FACILITY_TYPE_BASIC}
                role="button"
                data-keyboard-focus
                tabindex="0"
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
      <section
        class="roster facility-occupants defenders"
        data-prop="system.defenders"
        data-facility-type="defender"
      >
        <div class="bastion-header">
          <h3 class="font-title-small">
            <i class="fa-solid fa-shield"></i>
            {localize('TIDY5E.Facilities.Defenders.Label')}
          </h3>
          <tidy-gold-header-underline></tidy-gold-header-underline>
        </div>
        <ul class="unlist preview-large">
          {#each context.facilities.special.builtFacilities as chosen}
            {#each chosen.defenders as { actor, uuid }, index}
              {#if uuid}
                <FacilityRosterOccupantQuadrone
                  occupant={actor}
                  type="defender"
                  {index}
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

    {#if hasHirelings}
      <section
        class="roster facility-occupants hirelings"
        data-prop="system.hirelings"
        data-facility-type="hireling"
      >
        <div class="bastion-header">
          <h3 class="font-title-small">
            <i class="fa-solid fa-users"></i>
            {localize('TIDY5E.Facilities.Hirelings.Label')}
          </h3>
          <tidy-gold-header-underline></tidy-gold-header-underline>
        </div>

        <ul class="unlist preview-large">
          {#each context.facilities.special.builtFacilities as chosen}
            {#each chosen.hirelings as { actor, uuid }, index}
              {#if uuid}
                <FacilityRosterOccupantQuadrone
                  occupant={actor}
                  type="hireling"
                  {index}
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

    {#if hasCreatures}
      <section
        class="roster facility-occupants creatures"
        data-prop="system.trade.creatures"
        data-facility-type="creature"
      >
        <div class="bastion-header">
          <h3 class="font-title-small">
            <i class="fa-solid fa-horse-head"></i>
            {localize('TIDY5E.Facilities.Creatures.Label')}
          </h3>
          <tidy-gold-header-underline></tidy-gold-header-underline>
        </div>

        <ul class="unlist preview-large">
          {#each context.facilities.special.builtFacilities as chosen}
            {#each chosen.creatures as { actor, uuid }, index}
              {#if uuid}
                <FacilityRosterOccupantQuadrone
                  occupant={actor}
                  type="creature"
                  {index}
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

    <section class="description">
      <div class="bastion-header">
        <h3 class="font-title-small flexrow">
          <i class="fa-solid fa-books flexshrink"></i>
          <span class="flex1">
            {localize('DND5E.ACTIVITY.FIELDS.description.label')}
          </span>
          {#if context.editable}
            <a
              class="button button-borderless button-icon-only flexshrink"
              onclick={() => (editing = context.editable)}
            >
              <i class="fa-solid fa-feather"></i>
            </a>
          {/if}
        </h3>
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </div>

      {#if context.enriched.bastion}
        <div class="editor">
          <div
            data-target="system.bastion.description"
            class="user-select-text"
          >
            {@html context.enriched.bastion}
          </div>
        </div>
      {/if}
    </section>
  {/if}
</div>
