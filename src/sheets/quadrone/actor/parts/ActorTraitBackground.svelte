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

  let backgroundItem = $derived(
    background ? context.actor.items.get(background.id) : null,
  );

  const localize = FoundryAdapter.localize;
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
      {#if background}
        <!-- svelte-ignore a11y_missing_attribute -->
        <a
          role="button"
          tabindex="0"
          aria-label={localize('DND5E.DescriptionView', {
            description: localize('TYPES.Item.background'),
          })}
          data-keyboard-focus
          class="list-values trait-item"
          data-action="showDocument"
          data-uuid={backgroundItem?.uuid}
          onmousedown={(event) =>
            FoundryAdapter.editOnMiddleClick(event, backgroundItem)}
        >
          <!-- svelte-ignore a11y_missing_attribute -->
          <span class="item-image-link">
            <img
              src={background.img}
              alt={background.name}
              class="item-image flex0"
            />
          </span>
          <span class="font-weight-label">
            {background.name}
          </span>
        </a>
        {#if context.unlocked}
          <div class="list-controls">
            <button
              aria-label={localize('DND5E.DescriptionEdit', {
                description: localize('TYPES.Item.background'),
              })}
              type="button"
              class="button button-borderless button-icon-only"
              data-tooltip
              data-action="editDocument"
              data-uuid={backgroundItem?.uuid}
            >
              <i class="fa-solid fa-edit"></i>
            </button>
          </div>
        {/if}
      {:else}
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
          <i class="fa-solid fa-book-atlas"></i>
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
  </div>
{/if}
