<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Listbox from './Listbox.svelte';

  type TItem = $$Generic;

  interface Props {
    items: TItem[];
    selectedItemIndex?: number | null;
    labelProp: keyof TItem;
    valueProp: keyof TItem;
    listboxCssClass?: string | null;
    itemTemplate?: import('svelte').Snippet<[any]>;
    [key: string]: any;
  }

  let {
    items = $bindable(),
    selectedItemIndex = $bindable(null),
    labelProp,
    valueProp,
    listboxCssClass = null,
    itemTemplate,
    ...rest
  }: Props = $props();

  interface $$Slots {
    itemTemplate: { item: TItem };
  }

  function handleListboxKeydown(
    e: CustomEvent<KeyboardEvent & { currentTarget: HTMLElement }>,
  ): void {
    if (e.detail.key === 'ArrowUp' && e.detail.altKey) {
      moveUp();
    } else if (e.detail.key === 'ArrowDown' && e.detail.altKey) {
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

  function onDragStart(
    ev: CustomEvent<{ item: TItem; index: number; event: DragEvent }>,
  ) {
    selectedItemIndex = ev.detail.index;
    ev.detail.event.dataTransfer?.setData(
      'text/plain',
      ev.detail.index.toString(),
    );
  }

  function onDrop(
    ev: CustomEvent<{ item: TItem; index: number; event: DragEvent }>,
  ) {
    ev.detail.event.stopPropagation();
    ev.detail.event.preventDefault();

    const draggedIndex = parseInt(
      ev.detail.event.dataTransfer?.getData('text/plain') ?? '',
    );

    if (isNaN(draggedIndex)) {
      return;
    }

    const theDragged = items.at(draggedIndex);

    if (!theDragged) {
      return;
    }

    const dropTargetIndex = ev.detail.index;

    items = items.reduce<TItem[]>((acc, item, index) => {
      // When dropping onto a higher entry, the dragged should come before the target.
      if (index === dropTargetIndex && draggedIndex > dropTargetIndex) {
        acc.push(theDragged);
      }

      // The dragged item is being excluded from its original place in the list, to be placed elsewhere.
      if (index === draggedIndex) {
        return acc;
      }

      acc.push(item);

      // When dropping onto a lower entry, the dragged should come after the target.
      if (index === dropTargetIndex && draggedIndex < dropTargetIndex) {
        acc.push(theDragged);
      }

      return acc;
    }, []);

    selectedItemIndex = items.indexOf(theDragged);
  }

  function onListboxDrop(ev: CustomEvent<{ event: DragEvent }>) {
    const draggedIndex = parseInt(
      ev.detail.event.dataTransfer?.getData('text/plain') ?? '',
    );

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
      title={localize('TIDY5E.Listbox.MoveUp')}
      type="button"
      disabled={selectedItemIndex === null || selectedItemIndex === 0}
      aria-keyshortcuts="Alt+ArrowUp"
      data-testid="sorting-listbox-move-up"
      onclick={() => moveUp()}
    >
      <i class="fas fa-angle-up"></i>
    </button>
    <button
      title={localize('TIDY5E.Listbox.MoveDown')}
      type="button"
      disabled={selectedItemIndex === null ||
        items === null ||
        selectedItemIndex >= items.length - 1}
      aria-keyshortcuts="Alt+ArrowDown"
      onclick={() => moveDown()}
      data-testid="sorting-listbox-move-down"
    >
      <i class="fas fa-angle-down"></i>
    </button>
  </div>
  <Listbox
    bind:items
    {labelProp}
    {valueProp}
    bind:selectedItemIndex
    on:keydown={handleListboxKeydown}
    class="flex-1 {listboxCssClass ?? ''}"
    draggable={true}
    on:dragstart={(ev) => onDragStart(ev)}
    on:drop={(ev) => onDrop(ev)}
    on:listboxDrop={(ev) => onListboxDrop(ev)}
  >
    {#snippet itemTemplate({ item })}
      {#if itemTemplate_render}{@render itemTemplate_render({ item })}{:else}
        {item[labelProp]}
      {/if}
    {/snippet}
  </Listbox>
</div>
