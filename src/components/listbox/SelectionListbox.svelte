<script lang="ts">
  import type { Snippet } from 'svelte';
  import Listbox from './Listbox.svelte';
  import SelectionListboxToolbar from './SelectionListboxToolbar.svelte';

  type TItem = $$Generic;

  interface Props {
    leftItems: TItem[];
    selectedLeftItemIndex?: number | null;
    rightItems: TItem[];
    selectedRightItemIndex?: number | null;
    labelProp: keyof TItem;
    valueProp: keyof TItem;
    listboxCssClass?: string;
    leftHeader?: Snippet;
    rightHeader?: Snippet;
    leftItemTemplate?: Snippet<[any]>;
    rightItemTemplate?: Snippet<[any]>;
    [key: string]: any;
  }

  let {
    leftItems = $bindable(),
    selectedLeftItemIndex = $bindable(null),
    rightItems = $bindable(),
    selectedRightItemIndex = $bindable(null),
    labelProp,
    valueProp,
    listboxCssClass = '',
    leftHeader,
    rightHeader,
    leftItemTemplate,
    rightItemTemplate,
    ...rest
  }: Props = $props();

  interface $$Slots {
    leftHeader: any;
    rightHeader: any;
    leftItemTemplate: { item: TItem };
    rightItemTemplate: { item: TItem };
  }

  let selectedItemIndex = $derived(
    selectedLeftItemIndex ?? selectedRightItemIndex,
  );

  let selectedArray = $derived(
    selectedLeftItemIndex !== null
      ? leftItems
      : selectedRightItemIndex !== null
        ? rightItems
        : null,
  );

  function moveAllToTheLeft() {
    leftItems = [...leftItems, ...rightItems];
    rightItems = [];
    itemsMoved();
  }

  function moveUp() {
    if (
      selectedItemIndex === null ||
      selectedItemIndex === 0 ||
      selectedArray === null
    ) {
      return;
    }

    const topValue = selectedArray[selectedItemIndex - 1];
    const bottomValue = selectedArray[selectedItemIndex];
    selectedArray[selectedItemIndex - 1] = bottomValue;
    selectedArray[selectedItemIndex] = topValue;

    if (selectedLeftItemIndex) {
      selectedLeftItemIndex -= 1;
      leftItems = leftItems;
    } else if (selectedRightItemIndex) {
      selectedRightItemIndex -= 1;
      rightItems = rightItems;
    }

    itemsMoved();
  }

  function moveDown() {
    if (
      selectedArray === null ||
      selectedItemIndex === null ||
      selectedItemIndex >= selectedArray.length - 1
    ) {
      return;
    }

    const topValue = selectedArray[selectedItemIndex];
    const bottomValue = selectedArray[selectedItemIndex + 1];
    selectedArray[selectedItemIndex] = bottomValue;
    selectedArray[selectedItemIndex + 1] = topValue;

    if (selectedLeftItemIndex !== null) {
      selectedLeftItemIndex += 1;
      leftItems = leftItems;
    } else if (selectedRightItemIndex !== null) {
      selectedRightItemIndex += 1;
      rightItems = rightItems;
    }

    itemsMoved();
  }

  function moveLeft() {
    if (selectedRightItemIndex === null) {
      return;
    }

    const itemToMove = rightItems.splice(selectedRightItemIndex, 1)[0];

    if (!itemToMove) {
      return;
    }

    rightItems = rightItems;
    leftItems.push(itemToMove);
    leftItems = leftItems;
    itemsMoved({ scrollToEnd: 'left' });
  }

  function moveRight() {
    if (selectedLeftItemIndex === null) {
      return;
    }

    const itemToMove = leftItems.splice(selectedLeftItemIndex, 1)[0];

    if (!itemToMove) {
      return;
    }

    leftItems = leftItems;
    rightItems.push(itemToMove);
    rightItems = rightItems;
    itemsMoved({ scrollToEnd: 'right' });
  }

  function moveAllToTheRight() {
    rightItems = [...rightItems, ...leftItems];
    leftItems = [];
    itemsMoved();
  }

  function itemsMoved(options?: { scrollToEnd?: 'left' | 'right' }) {
    if (
      selectedLeftItemIndex !== null &&
      leftItems.at(selectedLeftItemIndex) === undefined
    ) {
      selectedLeftItemIndex = leftItems.length ? leftItems.length - 1 : null;
    }

    if (
      selectedRightItemIndex !== null &&
      rightItems.at(selectedRightItemIndex) === undefined
    ) {
      selectedRightItemIndex = rightItems.length ? rightItems.length - 1 : null;
    }
  }

  function onLeftListboxDblClick(
    e: MouseEvent & { currentTarget: HTMLElement },
  ) {
    moveRight();
  }

  function handleLeftListboxKeydown(
    e: KeyboardEvent & { currentTarget: HTMLElement },
  ): void {
    e.stopPropagation();

    if (e.code === 'Space') {
      moveRight();
      e.preventDefault();
    } else if (e.key === 'ArrowUp' && e.altKey) {
      moveUp();
    } else if (e.key === 'ArrowDown' && e.altKey) {
      moveDown();
    }
  }

  function onRightListboxDblClick(
    e: MouseEvent & { currentTarget: HTMLElement },
  ) {
    moveLeft();
  }

  function handleRightListboxKeydown(
    e: KeyboardEvent & { currentTarget: HTMLElement },
  ): void {
    e.stopPropagation();

    if (e.code === 'Space') {
      moveLeft();
      e.preventDefault();
    } else if (e.key === 'ArrowUp' && e.altKey) {
      moveUp();
    } else if (e.key === 'ArrowDown' && e.altKey) {
      moveDown();
    }
  }
</script>

<div class="selection-listbox flexrow {rest.class ?? ''}">
  <div class="flexcol">
    {#if leftHeader}
      {@render leftHeader?.()}
    {/if}
    <Listbox
      bind:items={leftItems}
      {labelProp}
      {valueProp}
      bind:selectedItemIndex={selectedLeftItemIndex}
      onselect={() => {
        selectedRightItemIndex = null;
      }}
      ondblclick={(detail) => onLeftListboxDblClick(detail.event)}
      onkeydown={handleLeftListboxKeydown}
      class={[listboxCssClass, 'listbox-selected']}
    >
      {#snippet itemTemplate({ item })}
        {#if leftItemTemplate}{@render leftItemTemplate({ item })}{:else}
          <i class="fa-solid fa-square-check"></i>
          {item[labelProp]}
        {/if}
      {/snippet}
    </Listbox>
  </div>
  <SelectionListboxToolbar
    moveUpDisabled={selectedItemIndex === null || selectedItemIndex === 0}
    onMoveUp={moveUp}
    moveDownDisabled={selectedItemIndex === null ||
      selectedArray === null ||
      selectedItemIndex >= selectedArray.length - 1}
    onMoveDown={moveDown}
    moveLeftDisabled={selectedLeftItemIndex !== null ||
      selectedRightItemIndex === null}
    onMoveLeft={moveLeft}
    moveRightDisabled={selectedLeftItemIndex === null ||
      selectedRightItemIndex !== null}
    onMoveRight={moveRight}
    moveAllToTheLeftDisabled={rightItems.length === 0}
    onMoveAllToTheLeft={moveAllToTheLeft}
    moveAllToTheRightDisabled={leftItems.length === 0}
    onMoveAllToTheRight={moveAllToTheRight}
    class="flexshrink"
  />
  <div class="flexcol">
    {#if rightHeader}
      {@render rightHeader?.()}
    {/if}
    <Listbox
      bind:items={rightItems}
      {labelProp}
      {valueProp}
      bind:selectedItemIndex={selectedRightItemIndex}
      onselect={() => {
        selectedLeftItemIndex = null;
      }}
      onkeydown={handleRightListboxKeydown}
      ondblclick={(detail) => onRightListboxDblClick(detail.event)}
      class={listboxCssClass}
    >
      {#snippet itemTemplate({ item })}
        {#if rightItemTemplate}{@render rightItemTemplate({ item })}{:else}
          <i class="fa-regular fa-square"></i>
          {item[labelProp]}
        {/if}
      {/snippet}
    </Listbox>
  </div>
</div>
