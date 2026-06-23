<script lang="ts" generics="Item">
  import type { ClassValue } from 'svelte/elements';
  import type { SortableListboxColumn } from './sortable-listbox.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { arrayMove } from 'src/utils/array';

  type Props = {
    items: Item[];
    iconClass?: keyof Item;
    key: keyof Item;
    orderConfig?: {
      getOrder: (item: Item) => number;
      setOrder: (item: Item, value: number) => void;
    };
    columns: SortableListboxColumn<Item>[];
    listboxClasses?: ClassValue;
    listItemClassesFn?: (item: Item) => ClassValue;
    headerClasses?: ClassValue;
  };

  let {
    items,
    key,
    iconClass,
    orderConfig,
    columns,
    listboxClasses,
    listItemClassesFn,
    headerClasses,
  }: Props = $props();

  let selectedIndex = $state<number | null>(null);

  // Vertical gap between rows, in px (keep in sync with the listbox `gap`).
  // This moves the offset for the drag indicator.
  const ROW_GAP = 8;

  function moveUp() {
    if (selectedIndex === null || selectedIndex === 0) {
      return;
    }
    arrayMove(items, selectedIndex, selectedIndex - 1);
    items = items;
    selectedIndex -= 1;
  }

  function moveDown() {
    if (selectedIndex === null || selectedIndex >= items.length - 1) {
      return;
    }
    arrayMove(items, selectedIndex, selectedIndex + 1);
    items = items;
    selectedIndex += 1;
  }

  function onListKeydown(ev: KeyboardEvent) {
    ev.stopPropagation();

    if (items.length === 0) {
      return;
    }

    const current = selectedIndex ?? -1;

    if (ev.key === 'ArrowUp' && ev.altKey) {
      moveUp();
      ev.preventDefault();
    } else if (ev.key === 'ArrowDown' && ev.altKey) {
      moveDown();
      ev.preventDefault();
    } else if (ev.key === 'ArrowUp') {
      selectedIndex = Math.max(0, current - 1);
      ev.preventDefault();
    } else if (ev.key === 'ArrowDown') {
      selectedIndex = Math.min(items.length - 1, current + 1);
      ev.preventDefault();
    }
  }

  let rowElements: HTMLLIElement[] = $state([]);
  let draggedIndex = $state<number | null>(null);
  let dropIndicatorIndex = $state<number | null>(null);

  // The indicator's y-offset, centered in the gap before `dropIndicatorIndex`.
  let dropLineTop = $derived.by(() => {
    if (dropIndicatorIndex === null) {
      return null;
    }

    if (dropIndicatorIndex < items.length) {
      const el = rowElements[dropIndicatorIndex];
      return el ? el.offsetTop - ROW_GAP + 2 : null;
    }

    const el = rowElements[items.length - 1];
    return el ? el.offsetTop + el.offsetHeight + ROW_GAP / 2 : null;
  });

  function onDragStart(ev: DragEvent, index: number) {
    draggedIndex = index;
    selectedIndex = index;
    ev.dataTransfer?.setData('text/plain', index.toString());
    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = 'move';
    }
  }

  // Target the entire list. Drop zone is midway between each item.
  function onListDragOver(ev: DragEvent) {
    ev.preventDefault();

    const y = ev.clientY;
    let gap = items.length;
    for (let i = 0; i < items.length; i++) {
      const rect = rowElements[i]?.getBoundingClientRect();
      if (rect && y < rect.top + rect.height / 2) {
        gap = i;
        break;
      }
    }

    // Hide the indicator when the drop would be a no-op (dropping next to self).
    if (
      draggedIndex !== null &&
      (gap === draggedIndex || gap === draggedIndex + 1)
    ) {
      dropIndicatorIndex = null;
      return;
    }

    dropIndicatorIndex = gap;
  }

  function onDragEnd() {
    draggedIndex = null;
    dropIndicatorIndex = null;
  }

  function onDrop(ev: DragEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    const draggedIdx = parseInt(ev.dataTransfer?.getData('text/plain') ?? '');
    const gap = dropIndicatorIndex;
    draggedIndex = null;
    dropIndicatorIndex = null;

    if (isNaN(draggedIdx) || gap === null) {
      return;
    }

    // Removing the dragged item shifts later positions down by one.
    const target = gap > draggedIdx ? gap - 1 : gap;
    if (target === draggedIdx) {
      return;
    }

    // TODO: switch sorting technique based on whether an orderFn is provided
    if (orderConfig) {
      const rowsToReorder = [...items];
      arrayMove(rowsToReorder, draggedIdx, target);

      rowsToReorder.entries().forEach(([index, row]) => {
        orderConfig.setOrder(row, index + 1);
      });

      selectedIndex = target;
    } else {
      arrayMove(items, draggedIdx, target);
    }
  }

  const sortedItems = $derived(
    orderConfig?.getOrder
      ? items.toSorted(
          (a, b) => orderConfig.getOrder(a) - orderConfig.getOrder(b),
        )
      : items,
  );

  const localize = FoundryAdapter.localize;
</script>

<fieldset class={['tab-selection-list', listboxClasses]}>
  <div class={['tab-selection-header', headerClasses]}>
    {#each columns as column}
      <span
        class={[
          'tab-selection-header-label font-label-medium',
          column.titleClasses,
        ]}
      >
        {column.title}
      </span>
    {/each}
  </div>
  <div class="tab-selection-body">
    <div class="controls">
      <button
        type="button"
        class="button button-primary button-icon-only"
        title={localize('TIDY5E.Listbox.MoveUp')}
        aria-keyshortcuts="Alt+ArrowUp"
        disabled={selectedIndex === null || selectedIndex === 0}
        onclick={moveUp}
      >
        <i class="fas fa-arrow-up"></i>
      </button>
      <button
        type="button"
        class="button button-primary button-icon-only"
        title={localize('TIDY5E.Listbox.MoveDown')}
        aria-keyshortcuts="Alt+ArrowDown"
        disabled={selectedIndex === null || selectedIndex >= items.length - 1}
        onclick={moveDown}
      >
        <i class="fas fa-arrow-down"></i>
      </button>
    </div>
    <ul
      class="tab-selection-listbox"
      role="listbox"
      tabindex="0"
      onkeydown={onListKeydown}
      ondragover={onListDragOver}
      ondrop={onDrop}
    >
      {#each sortedItems as item, i (item[key])}
        {const listItemClasses = $derived(listItemClassesFn?.(item))}
        <li
          class={['listbox-item', listItemClasses]}
          class:focused={selectedIndex === i}
          class:theme-dark={selectedIndex === i}
          class:dragging={draggedIndex === i}
          role="option"
          aria-selected={selectedIndex === i}
          draggable="true"
          onclick={() => (selectedIndex = i)}
          onkeydown={onListKeydown}
          ondragstart={(ev) => onDragStart(ev, i)}
          ondragend={onDragEnd}
        >
          <i class="drag-grip fa-solid fa-grip-lines fa-fw" aria-hidden="true"
          ></i>
          {#if iconClass}
            <i class="{item[iconClass]} fa-fw tab-row-icon"></i>
          {/if}
          {#each columns as column}
            {@render column.snippet?.(item)}
          {/each}
        </li>
      {/each}
      {#if dropLineTop !== null}
        <li
          class="drop-line"
          style="top: {dropLineTop}px"
          role="presentation"
          aria-hidden="true"
        ></li>
      {/if}
    </ul>
  </div>
</fieldset>
