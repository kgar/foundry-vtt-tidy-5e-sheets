<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { EventHelper } from 'src/utils/events';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let species = $derived(context.species?.id ? context.species : null);

  function openSheet(mode: number) {
    if (species) {
      context.actor.items.get(species.id).sheet.render({
        force: true,
        mode: mode,
      });
    }
  }
</script>

{#if context.unlocked || species}
  <!-- Species -->
  <div
    class="list-entry"
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
    data-item-id={species?.id}
    data-tidy-draggable
    ondragstart={(ev) => {
      const item = context.actor.items.get(species?.id);
      const dragData = item?.toDragData();
      ev.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
    }}
  >
    <div class="list-label">
      <h4 class="font-weight-label">
        {localize('TYPES.Item.race')}
      </h4>
    </div>
    <div class="list-content">
      <div class="list-values trait-item">
        {#if species}
          <a
            aria-label="View {localize('TYPES.Item.subclass')}"
            class="item-image-link"
            role="button"
            data-keyboard-focus
            tabindex="0"
            onclick={() => openSheet(CONSTANTS.SHEET_MODE_PLAY)}
            onkeydown={(e) => openSheet(CONSTANTS.SHEET_MODE_PLAY)}
          >
            <img
              src={species.img}
              alt={species.name}
              class="item-image flex0"
            />
          </a>
          <span class="font-weight-label trait-name">
            {species.name}
          </span>
        {:else if context.unlocked || !species}
          <button
            aria-label="Browse for {localize('TYPES.Item.race')}"
            type="button"
            class="button button-primary"
            data-tooltip="DND5E.Species.Add"
            onclick={(ev) =>
              context.actor.sheet.findItem({
                event: ev,
                type: 'race',
              })}
          >
            <i class="fa-solid fa-book-open-reader"></i>
            {localize('TIDY5E.CompendiumBrowser', {
              name: localize('TYPES.Item.race'),
            })}
          </button>
          <button
            aria-label={localize('DND5E.Species.Add')}
            type="button"
            class="button button-secondary"
            data-tooltip="DND5E.Species.Add"
            onclick={(ev) =>
              FoundryAdapter.createItem({ type: 'race' }, context.actor)}
          >
            {localize('TIDY5E.AddCustom', {
              name: localize('TYPES.Item.race'),
            })}
          </button>
        {/if}
      </div>
      {#if context.unlocked && species}
        <div class="list-controls">
          <button
            aria-label="Edit {localize('TYPES.Item.race')}"
            type="button"
            class="button button-borderless button-icon-only"
            data-tooltip="DND5E.ItemEdit"
            onclick={() => openSheet(CONSTANTS.SHEET_MODE_EDIT)}
          >
            <i class="fa-solid fa-edit"></i>
          </button>
          <button
            aria-label="{localize('TYPES.Item.race')} Context Menu"
            type="button"
            class="button button-borderless button-icon-only"
            onclick={(ev) =>
              EventHelper.triggerContextMenu(ev, '[data-item-id]')}
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
        {#if species}
          <i class="sub-entry-icon fa-solid fa-arrow-turn-down-right"></i>
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
      {#if context.unlocked && species}
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
