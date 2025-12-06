<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  let background = $derived(context.background);

  const localize = FoundryAdapter.localize;

  function openSheet(mode: number) {
    if (background) {
      context.actor.items.get(background.id).sheet.render({
        force: true,
        mode: mode,
      });
    }
  }
</script>

{#if context.unlocked || background}
  <div
    class="list-entry"
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
    data-item-id={background?.id}
    data-tidy-draggable
    ondragstart={(ev) => {
      const item = context.actor.items.get(background?.id);
      const dragData = item?.toDragData();
      ev.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
    }}
  >
    <div class="list-label">
      <h4 class="font-weight-label">
        {localize('TYPES.Item.background')}
      </h4>
    </div>
    <div class="list-content">
      <div class="list-values trait-item">
        {#if background}
          <a
            aria-label="View {localize('TYPES.Item.subclass')}"
            class="item-image-link"
            role="button"
            data-keyboard-focus
            tabindex="0"
            onclick={() => openSheet(CONSTANTS.SHEET_MODE_PLAY)}
            onkeydown={(e) =>
              e.key === 'Enter' && openSheet(CONSTANTS.SHEET_MODE_PLAY)}
          >
            <img
              src={background.img}
              alt={background.name}
              class="item-image flex0"
            />
          </a>
          <span class="font-weight-label">
            {background.name}
          </span>
        {:else if context.unlocked || !background}
          <button
            aria-label="Browse for {localize('TYPES.Item.background')}"
            type="button"
            class="button button-primary"
            data-tooltip="DND5E.BackgroundAdd"
            onclick={(ev) =>
              context.actor.sheet.findItem({
                event: ev,
                type: 'background',
              })}
          >
            <i class="fa-solid fa-book-open-reader"></i>
            {localize('TIDY5E.CompendiumBrowser', {
              name: localize('TYPES.Item.background'),
            })}
          </button>
          <button
            aria-label="Add {localize('TYPES.Item.background')}"
            type="button"
            class="button button-secondary"
            data-tooltip="DND5E.BackgroundAdd"
            onclick={(ev) =>
              FoundryAdapter.createItem({ type: 'background' }, context.actor)}
          >
            {localize('TIDY5E.AddCustom', {
              name: localize('TYPES.Item.background'),
            })}
          </button>
        {/if}
      </div>
      {#if context.unlocked && background}
        <div class="list-controls">
          <button
            aria-label="Edit {localize('TYPES.Item.background')}"
            type="button"
            class="button button-borderless button-icon-only"
            data-tooltip="DND5E.ItemEdit"
            onclick={() => openSheet(CONSTANTS.SHEET_MODE_EDIT)}
          >
            <i class="fa-solid fa-edit"></i>
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}
