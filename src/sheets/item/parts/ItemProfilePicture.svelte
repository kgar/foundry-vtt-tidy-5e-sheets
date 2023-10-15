<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e, ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  let hideImageMenu = true;

  function openItemImagePicker(target: HTMLImageElement, item: Item5e) {
    const rect = target.getBoundingClientRect();
    const current = item.img;
    const fp = new FilePicker({
      type: 'image',
      current,
      callback: (path: string) => {
        item.update({ img: path });
      },
      top: rect.top + 40,
      left: rect.left + 10,
    });
    return fp.browse();
  }

  function handleClick(event: MouseEvent) {
    if (event.button === CONSTANTS.MOUSE_BUTTON_MAIN) {
      openItemImagePicker(event.currentTarget as HTMLImageElement, $context.item);
    } else if (event.button === CONSTANTS.MOUSE_BUTTON_SECONDARY) {
      hideImageMenu = !hideImageMenu;
    }
  }

  function showItemArt(item: Item5e) {
    hideImageMenu = true;
    new ImagePopout(item.img, {
      title: 'Item: ' + item.name,
      shareable: true,
      uuid: item.uuid,
    }).render(true);
  }
</script>

<div class="item-image item-image-show-item-art">
  <img
    class="profile"
    src={$context.item.img}
    alt={$context.item.name}
    title="{localize('T5EK.EditActorImage')} / {localize('T5EK.ShowItemImage')}"
    on:mousedown={(event) => handleClick(event)}
  />
  <div class="item-menu" class:hidden={hideImageMenu}>
    <button class="showItemArt" on:click={() => showItemArt($context.item)}
      >{localize('T5EK.ShowItemArt')}</button
    >
  </div>
</div>
