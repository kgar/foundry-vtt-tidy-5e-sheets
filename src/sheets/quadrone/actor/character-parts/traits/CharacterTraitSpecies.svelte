<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { EventHelper } from 'src/utils/events';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

{#if context.unlocked || context.actor.system.details.race}
<!-- Species -->
<div
  class="list-entry"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-item-id={context.system.details.race?.id}
>
  <div class="list-label">
    <h4 class="font-weight-label">
      {localize('TYPES.Item.race')}
    </h4>
  </div>
  <div class="list-content">
    <div class="list-values trait-item">
      {#if context.actor.system.details.race}
        {@const species = context.actor.system.details.race}
        <a
          aria-label="View {localize('TYPES.Item.subclass')}"
          class="item-image-link"
          role="button"
          onclick={() => species.sheet.render({
            force: true,
            mode: CONSTANTS.SHEET_MODE_PLAY,
          })}
          onkeydown={(e) => e.key === 'Enter' && species.sheet.render({
            force: true,
            mode: CONSTANTS.SHEET_MODE_PLAY,
          })}
        >
          <img src={species.img} alt={species.name} class="item-image flex0" />
        </a>
        <span class="font-weight-label trait-name">
          {species.name}
        </span>
      {:else if context.unlocked}
        <button
          aria-label="Add {localize('TYPES.Item.race')}"
          type="button"
          class="button button-primary"
          data-tooltip="DND5E.Species.Add"
          onclick={(ev) =>
            FoundryAdapter.createItem({ type: 'race' }, context.actor)}
        >
          {localize('DND5E.Species.Add')}
        </button>
        <button 
          aria-label="Browse for {localize('TYPES.Item.race')}"
          type="button"
          class="button button-borderless button-icon-only"
          data-tooltip="DND5E.Species.Add"
          onclick={(ev) =>
            context.actor.sheet.findItem({
              event: ev,
              type: 'race',
            })}
        >
          <i class="fa-solid fa-book-open-reader"></i>
        </button>
      {/if}
    </div>
    {#if context.unlocked && context.actor.system.details.race}
      <div class="list-controls">
        <button
          aria-label="Edit {localize('TYPES.Item.race')}"
          type="button"
          class="button button-borderless button-icon-only"
          data-tooltip="DND5E.ItemEdit"
          onclick={() =>
            context.actor.system.details.race.sheet.render({
              force: true,
              mode: CONSTANTS.SHEET_MODE_EDIT,
            })}
        >
          <i class="fa-solid fa-edit"></i>
        </button>
        <button
          aria-label="{localize('TYPES.Item.race')} Context Menu"
          type="button"
          class="button button-borderless button-icon-only"
          onclick={(ev) => EventHelper.triggerContextMenu(ev, '[data-item-id]')}
        >
          <i class="fa-solid fa-ellipsis-vertical fa-fw"></i>
        </button>
      </div>
    {/if}
  </div>
</div>

<!-- Creature Type -->
<div class="list-entry list-sub-entry">
  <div class="list-label">
    <h4 class="font-weight-label">
      {localize('DND5E.CreatureType')}
    </h4>
  </div>
  <div class="list-content">
    <div class="list-values trait-item">
      {#if context.system.details.race}
        <i class="sub-entry-icon fa-solid fa-arrow-turn-down-right "></i>
      {/if}
      <span class="trait-name font-label-medium">
        {context.creatureType.title}
      </span>
      {#if context.creatureType.subtitle}
        <span class="font-body-medium color-text-lighter">
          {context.creatureType.subtitle}
        </span>
      {/if}
    </div>
    {#if context.unlocked && context.system.details.race}
      <div class="list-controls">
        <button
          aria-label="Edit {localize('DND5E.CreatureType')}"
          type="button"
          class="button button-borderless button-icon-only"
          data-tooltip="DND5E.ItemEdit"
          onclick={() =>
            FoundryAdapter.renderCreatureTypeConfig(context.actor)}
        >
          <i class="fa-solid fa-edit"></i>
        </button>
      </div>
    {/if}
  </div>
</div>
{/if}
