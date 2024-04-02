<script lang="ts" generics="TItem extends Record<string, unknown>">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Listbox from './Listbox.svelte';

  export let items: TItem[];
  export let selectedItemIndex: number | null = null;
  export let labelProp: string;
  export let valueProp: string;
  export let listboxCssClass: string | null = null;

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

  function onDragEnter(
    ev: CustomEvent<{ item: TItem; index: number; event: DragEvent }>,
  ) {
    const target = ev.detail.event.currentTarget;
    if (target instanceof HTMLElement && target.matches('[role="option"]')) {
      target.classList.add('dragged-over');
    }
  }
  function onDragLeave(
    ev: CustomEvent<{ item: TItem; index: number; event: DragEvent }>,
  ) {
    const target = ev.detail.event.currentTarget;
    if (target instanceof HTMLElement && target.matches('[role="option"]')) {
      target.classList.remove('dragged-over');
    }
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

    const targetIndex = ev.detail.index;

    items = items.reduce<TItem[]>((acc, item, index) => {
      if (index === targetIndex) {
        acc.push(theDragged);
      }

      if (index === draggedIndex) {
        return acc;
      }

      acc.push(item);

      return acc;
    }, []);

    selectedItemIndex = items.indexOf(theDragged);

    onDragLeave(ev);
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
</script>

<div class="sorting-listbox flex-row small-gap {$$restProps.class ?? ''}">
  <div class="controls">
    <button
      title={localize('TIDY5E.Listbox.MoveUp')}
      type="button"
      disabled={selectedItemIndex === null || selectedItemIndex === 0}
      on:click={() => moveUp()}
    >
      <i class="fas fa-angle-up"></i>
    </button>
    <button
      title={localize('TIDY5E.Listbox.MoveDown')}
      type="button"
      disabled={selectedItemIndex === null ||
        items === null ||
        selectedItemIndex >= items.length - 1}
      on:click={() => moveDown()}
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
    on:dragenter={(ev) => onDragEnter(ev)}
    on:dragleave={(ev) => onDragLeave(ev)}
    on:drop={(ev) => onDrop(ev)}
    on:listboxDrop={(ev) => onListboxDrop(ev)}
  />
</div>

<style lang="scss">
  .sorting-listbox {
    :global([role='option']) {
      transition: padding-top 0.125s ease;
    }

    :global([role='option'].dragged-over) {
      padding-top: 1rem;
    }
  }

  .controls {
    align-self: center;

    button + button {
      margin-top: 0.25rem;
    }
  }
</style>
