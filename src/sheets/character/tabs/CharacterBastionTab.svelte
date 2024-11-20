<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CharacterSheetRuntime } from 'src/runtime/CharacterSheetRuntime';
  import type { CharacterSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import FacilityOccupant from 'src/sheets/character/parts/FacilityOccupant.svelte';
  import FacilityRosterOccupant from 'src/sheets/character/parts/FacilityRosterOccupant.svelte';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';

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
    const otherType = type === 'basic' ? 'special' : 'basic';
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
          >
            <div class="facility-header">
              <!-- svelte-ignore a11y-missing-attribute -->
              <a class="title-and-subtitle">
                <span class="title"> {chosen.name} </span>
                <span class="subtitle">
                  {chosen.subtitle}
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
            {#if chosen.progress.max || chosen.executing}
              {@const icon = CharacterSheetRuntime.getTidyFacilityIcon(
                chosen.progress.order,
              )}

              <div class="sub-header">
                {localize('DND5E.FACILITY.FIELDS.order.label')}
              </div>
              <!-- TODO: To Component with TODO about svelte 5 snippets -->
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
                    {getOrderLabel(chosen.progress.order)}
                  </span>
                  <span class="counter">
                    <span class="value">{chosen.progress.value}</span> &sol;
                    <span class="max">{chosen.progress.max}</span>
                  </span>
                </div>
                <!-- TODO: Handle showing item image when crafting an item -->
              </div>
            {/if}
          </li>
        {/each}
        {#each $context.facilities.special.available as available}
          <li class="facility empty">
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
              class="highlight-on-hover"
              on:click={() => addFacility('special')}
            >
              <!-- TODO: 'special' -> to constants -->
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
        <li class="facility">
          <div class="facility-header">
            <a class="title">Keeping Room</a>
            <ul>
              <li>Unbuilt</li>
            </ul>
          </div>
        </li>
        <li class="facility">
          <div class="facility-header">
            <a class="title">Bedchambers</a>
            <ul>
              <li>Cramped</li>
              <li>Bedroom</li>
            </ul>
            <a class="transparent-icon-button">
              <i class="fas fa-ellipsis-vertical"></i>
            </a>
          </div>
          <div class="sub-header">Order</div>
          <div class="meter progress">
            <span class="order"> Enlarge </span>
            <span>
              <span class="elapsed">45</span> / <span class="total">80</span>
            </span>
          </div>
        </li>
        <li class="facility empty">
          <a class="highlight-on-hover">
            <i class="fa-solid fa-trowel"></i>
            {localize('DND5E.FACILITY.AvailableFacility.basic.build')}
          </a>
        </li>
        <li class="facility empty">
          <a class="highlight-on-hover">
            <i class="fas fa-chess-rook"></i>
            {localize('DND5E.FACILITY.AvailableFacility.basic.free')}
          </a>
        </li>
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
  <section class="description">
    <h3><i class="fa-solid fa-books"></i> Description</h3>
  </section>
</div>
