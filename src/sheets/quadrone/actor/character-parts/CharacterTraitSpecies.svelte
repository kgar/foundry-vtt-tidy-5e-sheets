<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { EventHelper } from 'src/utils/events';
  
  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

<div
  class="list-entry"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-item-id={context.system.details.race?.id}
>
  <div class="list-label">
    <h4>
      {localize('TYPES.Item.race')}
    </h4>
    {#if context.unlocked && !context.system.details.race}
      <button
        type="button"
        class="button button-borderless button-icon-only"
        data-tooltip="DND5E.Species.Add"
        onclick={(ev) =>
          FoundryAdapter.showSpeciesCompendiumBrowser(context.actor)}
      >
        <i class="fa-solid fa-plus"></i>
      </button>
    {/if}
  </div>
  <div class="list-values">
    {#if context.actor.system.details.race}
      {@const species = context.actor.system.details.race}
      <img src={species.img} alt={species.name} class="item-image flex0" />

      <span class="font-weight-label">
        {species.name}
      </span>

      <span class="font-weight-default color-text-lighter">
        {context.creatureType.title}
      </span>
      {#if context.creatureType.subtitle}
        <span class="font-weight-default color-text-lighter">
          {context.creatureType.subtitle}
        </span>
      {/if}
    {/if}
  </div>
  {#if context.unlocked && context.actor.system.details.race}
    <div class="list-controls">
      <button
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
        type="button"
        class="button button-borderless button-icon-only"
        onclick={(ev) => EventHelper.triggerContextMenu(ev, '[data-item-id]')}
      >
        <i class="fa-solid fa-ellipsis-vertical fa-fw"></i>
      </button>
    </div>
  {/if}
</div>
