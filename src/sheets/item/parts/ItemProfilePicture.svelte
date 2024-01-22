<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import type { Item5e, ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  let hideImageMenu = true;

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
    hideImageMenu = true;
    FoundryAdapter.renderImagePopout(item.img, {
      title: 'Item: ' + item.name,
      shareable: true,
      uuid: item.uuid,
    });
  }
</script>

<div class="item-image item-image-show-item-art">
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- TODO: Figure out if there is an accessible way to provide this feature. -->
  <img
    class="profile"
    src={$context.item.img}
    alt={$context.item.name}
    title="{localize('T5EK.EditActorImage')} / {localize('T5EK.ShowItemImage')}"
    on:click={(event) =>
      openItemImagePicker(event.currentTarget, $context.item)}
    on:contextmenu={() => (hideImageMenu = !hideImageMenu)}
  />
  <div class="item-menu" class:hidden={hideImageMenu}>
    <button
      class="showItemArt"
      on:click={() => showItemArt($context.item)}
      tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
      >{localize('T5EK.ShowItemArt')}</button
    >
  </div>
</div>
