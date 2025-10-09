<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import type { ContextMenuEntry } from 'src/foundry/foundry.types';
  import FloatingContextMenu from 'src/context-menu/FloatingContextMenu';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  const localize = FoundryAdapter.localize;

  let itemImageContainer: HTMLElement;
  let contextMenuOptions: ContextMenuEntry[] = $derived([
    {
      name: 'TIDY5E.ShowItemArt',
      icon: '<i class="fa-solid fa-image fa-fw"></i>',
      callback: () =>
        context.sheet.options.actions.showIcon.call(context.sheet),
    },
  ]);

  $effect(() => {
    new FloatingContextMenu(
      itemImageContainer,
      `[data-tidy-sheet-part=${CONSTANTS.SHEET_PARTS.ITEM_IMAGE_CONTAINER}]`,
      [],
      {
        onOpen: () => {
          ui.context.menuItems = contextMenuOptions;
        },
        jQuery: false,
        layout: CONSTANTS.SHEET_LAYOUT_CLASSIC,
      },
    );
  });
</script>

<div
  class="item-image item-image-show-item-art"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_IMAGE_CONTAINER}
  bind:this={itemImageContainer}
>
  <img
    class="profile"
    class:conceal={context.item.system.identified === false}
    src={context.item.img}
    alt={context.item.name}
    title="{localize('TIDY5E.EditSheetImageHint')} / {localize(
      'TIDY5E.SheetImageOptionsHint',
    )}"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_IMAGE}
    data-action="editImage"
    data-edit={context.unlocked ? 'img' : null}
    data-type={context.unlocked ? 'image' : null}
  />
  <div
    role="presentation"
    aria-hidden="true"
    class="unidentified-glyph"
    class:conceal={context.item.system.identified === false}
  >
    <i class="fas fa-question"></i>
  </div>
</div>
