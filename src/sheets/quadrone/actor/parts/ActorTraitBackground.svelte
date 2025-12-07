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
    role="listitem"
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
          <!-- svelte-ignore a11y_missing_attribute -->
          <a
            role="button"
            tabindex="0"
            aria-label="View {localize('TYPES.Item.background')}"
            class="item-image-link"
            data-keyboard-focus
            onclick={() => openSheet(CONSTANTS.SHEET_MODE_PLAY)}
            onkeydown={(ev) =>
              ev.key === 'Enter' && openSheet(CONSTANTS.SHEET_MODE_PLAY)}
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
            aria-label={localize('TIDY5E.CompendiumBrowser', {
              name: localize('TYPES.Item.background'),
            })}
            type="button"
            class="button button-primary"
            data-tooltip
            onclick={(ev) =>
              context.actor.sheet.findItem({
                event: ev,
                type: 'background',
              })}
          >
            <i class="fa-solid fa-book-open-reader"></i>
            {localize('DND5E.BackgroundAdd')}
          </button>
          <button
            aria-label={localize('TIDY5E.AddCustom', {
              name: localize('TYPES.Item.background'),
            })}
            type="button"
            class="button button-secondary"
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
            aria-label={localize('DND5E.DescriptionEdit', {
              description: localize('TYPES.Item.background'),
            })}
            type="button"
            class="button button-borderless button-icon-only"
            data-tooltip
            onclick={() => openSheet(CONSTANTS.SHEET_MODE_EDIT)}
          >
            <i class="fa-solid fa-edit"></i>
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}
