<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { isUserInteractable } from 'src/utils/element';
  import { EventHelper } from 'src/utils/events';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let species = $derived(context.species?.id ? context.species : null);

  let speciesItem = $derived(
    species ? context.actor.items.get(species.id) : null,
  );

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
    {#if species}
    <!-- svelte-ignore a11y_missing_attribute -->
    <a
      role="button"
      tabindex="0"
      aria-label={localize('DND5E.DescriptionView', {
        description: localize('TYPES.Item.race'),
      })}
      data-keyboard-focus
      class="list-values trait-item"
      onclick={() => openSheet(CONSTANTS.SHEET_MODE_PLAY)}
      onmousedown={(event) =>
        FoundryAdapter.editOnMiddleClick(event, speciesItem)}
      onkeydown={(e) =>
        (e.key === 'Enter' || e.key === ' ') &&
        openSheet(CONSTANTS.SHEET_MODE_PLAY)}
    >
        <span class="item-image-link">
          <img src={species.img} alt={species.name} class="item-image flex0" />
        </span>
        <span class="font-weight-label trait-name">
          {species.name}
        </span>
    </a>
    {#if context.unlocked}
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
          aria-label={localize('Tidy5E.ContextMenu')}
          type="button"
          class="button button-borderless button-icon-only"
          onclick={(ev) => EventHelper.triggerContextMenu(ev, '[data-item-id]')}
        >
          <i class="fa-solid fa-ellipsis-vertical fa-fw"></i>
        </button>
      </div>
    {/if}
    {:else}
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
        <i class="fa-solid fa-book-atlas"></i>
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
</div>

<!-- Creature Type -->
<div class="list-entry list-sub-entry">
  <div class="list-label">
    <h4 class="font-weight-label">
      {localize('DND5E.CreatureType')}
    </h4>
  </div>
  <div class="list-content">
    <!-- svelte-ignore a11y_missing_attribute -->
    <a
      class="list-values trait-item {species ? '' : 'no-hover'}"
      role="button"
      tabindex="0"
      aria-label={localize('DND5E.DescriptionView', {
        description: localize('DND5E.CreatureType'),
      })}
      data-keyboard-focus
      onclick={() => {if (species) FoundryAdapter.renderCreatureTypeConfig(context.actor);}}
      onkeydown={(e) => { 
        if (species) {
          (e.key === 'Enter' || e.key === ' ') &&
          FoundryAdapter.renderCreatureTypeConfig(context.actor)}
        }}
      >
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
    </a>
    {#if context.unlocked && species}
      <div class="list-controls">
        <button
          aria-label={localize('DND5E.DescriptionEdit', {
            description: localize('DND5E.CreatureType'),
          })}
          type="button"
          class="button button-borderless button-icon-only"
          data-tooltip
          onclick={() => FoundryAdapter.renderCreatureTypeConfig(context.actor)}
        >
          <i class="fa-solid fa-edit"></i>
        </button>
      </div>
    {/if}
  </div>
</div>
