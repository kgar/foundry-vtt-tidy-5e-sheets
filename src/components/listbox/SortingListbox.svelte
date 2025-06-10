<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Listbox from './Listbox.svelte';
  import type { Snippet } from 'svelte';
  import { arrayMove } from 'src/utils/array';
  import type { ClassValue } from 'svelte/elements';

  type TItem = $$Generic;

  interface Props {
    items: TItem[];
    selectedItemClasses?: ClassValue;
    selectedItemIndex?: number | null;
    labelProp: keyof TItem;
    valueProp: keyof TItem;
    listboxCssClass?: string | null;
    listItemClasses?: string;
    itemTemplate?: Snippet<[any]>;
    [key: string]: any;
  }

  let {
    items = $bindable(),
    selectedItemClasses,
    selectedItemIndex = $bindable(null),
    labelProp,
    valueProp,
    listboxCssClass = null,
    listItemClasses,
    itemTemplate,
    ...rest
  }: Props = $props();

  interface $$Slots {
    itemTemplate: { item: TItem };
  }

  function handleListboxKeydown(
    e: KeyboardEvent & { currentTarget: HTMLElement },
  ): void {
    if (e.key === 'ArrowUp' && e.altKey) {
      moveUp();
    } else if (e.key === 'ArrowDown' && e.altKey) {
      moveDown();
    }
  }

  function moveUp() {
    if (
      selectedItemIndex === null ||
      selectedItemIndex === 0 ||
      items === null
    ) {
      return;
    }

    const topValue = items[selectedItemIndex - 1];
    const bottomValue = items[selectedItemIndex];
    items[selectedItemIndex - 1] = bottomValue;
    items[selectedItemIndex] = topValue;

    if (selectedItemIndex) {
      selectedItemIndex -= 1;
      items = items;
    }

    itemsMoved();
  }

  function moveDown() {
    if (
      items === null ||
      selectedItemIndex === null ||
      selectedItemIndex >= items.length - 1
    ) {
      return;
    }

    const topValue = items[selectedItemIndex];
    const bottomValue = items[selectedItemIndex + 1];
    items[selectedItemIndex] = bottomValue;
    items[selectedItemIndex + 1] = topValue;

    if (selectedItemIndex !== null) {
      selectedItemIndex += 1;
      items = items;
    }

    itemsMoved();
  }

  function itemsMoved() {
    if (
      selectedItemIndex !== null &&
      items.at(selectedItemIndex) === undefined
    ) {
      selectedItemIndex = items.length ? items.length - 1 : null;
    }
  }

  function onDragStart(ev: { item: TItem; index: number; event: DragEvent }) {
    selectedItemIndex = ev.index;
    ev.event.dataTransfer?.setData('text/plain', ev.index.toString());
  }

  function onDrop(ev: { item: TItem; index: number; event: DragEvent }) {
    ev.event.stopPropagation();
    ev.event.preventDefault();

    const draggedIndex = parseInt(
      ev.event.dataTransfer?.getData('text/plain') ?? '',
    );

    if (isNaN(draggedIndex)) {
      return;
    }

    const theDragged = items.at(draggedIndex);

    if (!theDragged) {
      return;
    }

    const dropTargetIndex = ev.index;

    arrayMove(items, draggedIndex, dropTargetIndex);

    selectedItemIndex = items.indexOf(theDragged);
  }

  function onListboxDrop(ev: DragEvent) {
    const draggedIndex = parseInt(ev.dataTransfer?.getData('text/plain') ?? '');

    if (isNaN(draggedIndex)) {
      return;
    }

    const theDragged = items.splice(draggedIndex, 1);

    items.push(...theDragged);
    items = items;
  }

  const localize = FoundryAdapter.localize;

  const itemTemplate_render = $derived(itemTemplate);
</script>

<div class="sorting-listbox flex-row small-gap {rest.class ?? ''}">
  <div class="controls">
    <button
      class="button button-icon-only"
      title={localize('TIDY5E.Listbox.MoveUp')}
      type="button"
      disabled={selectedItemIndex === null || selectedItemIndex === 0}
      aria-keyshortcuts="Alt+ArrowUp"
      data-testid="sorting-listbox-move-up"
      onclick={() => moveUp()}
    >
      <i class="fas fa-arrow-up"></i>
    </button>
    <button
      class="button button-icon-only"
      title={localize('TIDY5E.Listbox.MoveDown')}
      type="button"
      disabled={selectedItemIndex === null ||
        items === null ||
        selectedItemIndex >= items.length - 1}
      aria-keyshortcuts="Alt+ArrowDown"
      onclick={() => moveDown()}
      data-testid="sorting-listbox-move-down"
    >
      <i class="fas fa-arrow-down"></i>
    </button>
  </div>
  <Listbox
    {selectedItemClasses}
    bind:items
    {labelProp}
    {valueProp}
    bind:selectedItemIndex
    onkeydown={handleListboxKeydown}
    class="flex-1 {listboxCssClass ?? ''}"
    {listItemClasses}
    draggable={true}
    ondragstart={(ev) => onDragStart(ev)}
    ondrop={(ev) => onDrop(ev)}
    onlistboxDrop={(ev) => onListboxDrop(ev)}
  >
    {#snippet itemTemplate({ item })}
      {#if itemTemplate_render}{@render itemTemplate_render({ item })}{:else}
        {item[labelProp]}
      {/if}
    {/snippet}
  </Listbox>
</div>
