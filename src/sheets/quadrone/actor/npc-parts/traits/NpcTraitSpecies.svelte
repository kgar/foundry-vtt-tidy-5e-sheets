<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { EventHelper } from 'src/utils/events';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let species = $derived(context.species);

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
      <a role="button"
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
        <!-- svelte-ignore a11y_missing_attribute -->
        <span
          aria-label={localize('DND5E.DescriptionView', {
            description: localize('TYPES.Item.race'),
          })}
          class="item-image-link"
        >
          <img src={species.img} alt={species.name} class="item-image flex0" />
        </span>
        <span class="font-weight-label trait-name">
          {species.name}
        </span>
      </a>
        
      {#if context.unlocked}
        <div class="list-controls">
          <button
            aria-label="Edit {localize('TYPES.Item.race')}"
            type="button"
            class="button button-borderless button-icon-only"
            data-tooltip={localize('DND5E.ItemEdit')}
            onclick={() => openSheet(CONSTANTS.SHEET_MODE_EDIT)}
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
    {:else}
      <button
        aria-label={localize('TIDY5E.CompendiumBrowser', {
          name: localize('TYPES.Item.race'),
        })}
        type="button"
        class="button button-primary"
        data-tooltip={localize('TIDY5E.CompendiumBrowser', {
          name: localize('TYPES.Item.race'),
        })}
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
