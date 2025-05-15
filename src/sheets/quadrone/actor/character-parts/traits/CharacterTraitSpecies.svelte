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
  </div>
  <div class="list-values">
    {#if context.actor.system.details.race}
      {@const species = context.actor.system.details.race}
      <img src={species.img} alt={species.name} class="item-image flex0" />

      <span class="font-weight-label trait-name">
        {species.name}
      </span>
    {:else if context.unlocked}
      <div class="list-values">
        <button
          type="button"
          class="button button-borderless"
          data-tooltip="DND5E.Species.Add"
          onclick={(ev) =>
            FoundryAdapter.createItem({ type: 'race' }, context.actor)}
        >
          {localize('DND5E.Species.Add')}
        </button>
        <button
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
      </div>
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
