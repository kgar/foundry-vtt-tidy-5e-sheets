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

<!-- Species -->
<div
  class="list-entry"
  role="listitem"
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
        <!-- svelte-ignore a11y_missing_attribute -->
        <a
          role="button"
          tabindex="0"
          aria-label="View {localize('TYPES.Item.race')}"
          class="item-image-link"
          data-keyboard-focus
          onclick={() => openSheet(CONSTANTS.SHEET_MODE_PLAY)}
          onkeydown={(ev) =>
            ev.key === 'Enter' && openSheet(CONSTANTS.SHEET_MODE_PLAY)}
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
          aria-label={localize('TIDY5E.CompendiumBrowser', {
            name: localize('TYPES.Item.race'),
          })}
          type="button"
          class="button button-primary"
          data-tooltip
          onclick={(ev) =>
            context.actor.sheet.findItem({
              event: ev,
              type: 'race',
            })}
        >
          <i class="fa-solid fa-book-open-reader"></i>
          {localize('DND5E.Species.Add')}
        </button>
        <button
          aria-label={localize('TIDY5E.AddCustom', {
            name: localize('TYPES.Item.race'),
          })}
          type="button"
          class="button button-secondary"
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
          aria-label={localize('DND5E.DescriptionEdit', {
            description: localize('TYPES.Item.race'),
          })}
          type="button"
          class="button button-borderless button-icon-only"
          data-tooltip
          onclick={() => openSheet(CONSTANTS.SHEET_MODE_EDIT)}
        >
          <i class="fa-solid fa-edit"></i>
        </button>
        <button
          aria-label="{localize('Tidy5E.ContextMenu')}"
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
          aria-label={localize('DND5E.DescriptionEdit', {
            description: localize('DND5E.CreatureType'),
          })}
          type="button"
          class="button button-borderless button-icon-only"
          data-tooltip
          onclick={() =>
            FoundryAdapter.renderCreatureTypeConfig(context.actor)}
        >
          <i class="fa-solid fa-edit"></i>
        </button>
      </div>
    {/if}
  </div>
</div>
