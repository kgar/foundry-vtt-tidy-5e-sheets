<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import type { ContextMenuEntry } from 'src/foundry/foundry.types';
  import FloatingContextMenu from 'src/context-menu/FloatingContextMenu';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = getItemSheetContext();

  const localize = FoundryAdapter.localize;

  function openItemImagePicker(target: HTMLImageElement, item: Item5e) {
    const rect = target.getBoundingClientRect();
    const current = item.img;
    return FoundryAdapter.browseFilePicker({
      type: 'image',
      current,
      callback: (path: string) => {
        item.update({ img: path });
      },
      top: rect.top + 40,
      left: rect.left + 10,
    });
  }

  function showItemArt(item: Item5e) {
    FoundryAdapter.renderImagePopout(item.img, {
      title: FoundryAdapter.localize('TIDY5E.ItemImageTitle', {
        subject: item.name,
      }),
      shareable: true,
      uuid: item.uuid,
    });
  }

  let itemImageContainer: HTMLElement;
  let contextMenuOptions: ContextMenuEntry[] = $derived([
    {
      name: 'TIDY5E.ShowItemArt',
      icon: '<i class="fa-solid fa-image fa-fw"></i>',
      callback: () => showItemArt(context.item),
    },
  ]);

  $effect(() => {
    new FloatingContextMenu(
      FoundryAdapter.getJqueryWrappedElement(itemImageContainer),
      `[data-tidy-sheet-part=${CONSTANTS.SHEET_PARTS.ITEM_IMAGE_CONTAINER}]`,
      [],
      {
        onOpen: () => {
          ui.context.menuItems = contextMenuOptions;
        },
      },
    );
  });
</script>

<div
  class="item-image item-image-show-item-art"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_IMAGE_CONTAINER}
  bind:this={itemImageContainer}
>
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- TODO: Figure out if there is an accessible way to provide this feature. -->
  <img
    class="profile"
    class:conceal={context.item.system.identified === false}
    src={context.item.img}
    alt={context.item.name}
    title="{localize('TIDY5E.EditSheetImageHint')} / {localize(
      'TIDY5E.SheetImageOptionsHint',
    )}"
    onclick={(event) => openItemImagePicker(event.currentTarget, context.item)}
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_IMAGE}
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
