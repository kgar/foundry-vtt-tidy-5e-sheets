<script lang="ts">
  import Listbox from './Listbox.svelte';
  import SelectionListboxToolbar from './SelectionListboxToolbar.svelte';

  export let leftItems: any[];
  export let selectedLeftItemIndex: number | null = null;
  export let rightItems: any[];
  export let selectedRightItemIndex: number | null = null;
  export let labelProp: string;
  export let valueProp: string;
  export let listboxCssClass: string = '';

  $: selectedItemIndex = selectedLeftItemIndex ?? selectedRightItemIndex;
  $: selectedArray =
    selectedLeftItemIndex !== null
      ? leftItems
      : selectedRightItemIndex !== null
        ? rightItems
        : null;

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

  function handleLeftListboxKeydown(
    e: CustomEvent<KeyboardEvent & { currentTarget: HTMLElement }>,
  ): void {
    if (e.detail.code === 'Space') {
      moveRight();
      e.detail.preventDefault();
    } else if (e.detail.key === 'ArrowUp' && e.detail.altKey) {
      moveUp();
    } else if (e.detail.key === 'ArrowDown' && e.detail.altKey) {
      moveDown();
    }
  }
  function handleRightListboxKeydown(
    e: CustomEvent<KeyboardEvent & { currentTarget: HTMLElement }>,
  ): void {
    if (e.detail.code === 'Space') {
      moveLeft();
      e.detail.preventDefault();
    } else if (e.detail.key === 'ArrowUp' && e.detail.altKey) {
      moveUp();
    } else if (e.detail.key === 'ArrowDown' && e.detail.altKey) {
      moveDown();
    }
  }
</script>

<div class="selection-listbox {$$props.class ?? ''}">
  {#if $$slots['left-header'] || $$slots['right-header']}
    <div class="column-1">
      <slot name="left-header" />
    </div>
    <div class="column-3">
      <slot name="right-header" />
    </div>
  {/if}
  <Listbox
    bind:items={leftItems}
    {labelProp}
    {valueProp}
    bind:selectedItemIndex={selectedLeftItemIndex}
    on:select={() => {
      selectedRightItemIndex = null;
    }}
    on:keydown={handleLeftListboxKeydown}
    class="column-1 {listboxCssClass}"
  />
  <SelectionListboxToolbar
    moveUpDisabled={selectedItemIndex === null || selectedItemIndex === 0}
    on:moveUp={moveUp}
    moveDownDisabled={selectedItemIndex === null ||
      selectedArray === null ||
      selectedItemIndex >= selectedArray.length - 1}
    on:moveDown={moveDown}
    moveLeftDisabled={selectedLeftItemIndex !== null ||
      selectedRightItemIndex === null}
    on:moveLeft={moveLeft}
    moveRightDisabled={selectedLeftItemIndex === null ||
      selectedRightItemIndex !== null}
    on:moveRight={moveRight}
    moveAllToTheLeftDisabled={rightItems.length === 0}
    on:moveAllToTheLeft={moveAllToTheLeft}
    moveAllToTheRightDisabled={leftItems.length === 0}
    on:moveAllToTheRight={moveAllToTheRight}
    class="column-2"
  />
  <Listbox
    bind:items={rightItems}
    {labelProp}
    {valueProp}
    bind:selectedItemIndex={selectedRightItemIndex}
    on:select={() => {
      selectedLeftItemIndex = null;
    }}
    on:keydown={handleRightListboxKeydown}
    class="column-3 {listboxCssClass}"
  />
</div>

<style>
  .selection-listbox {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: auto 1fr;
    min-height: 0;
    max-height: inherit;
    height: 100%;
    gap: 0.5rem;
  }

  .selection-listbox :global(.column-1) {
    grid-column: 1;
  }
  .selection-listbox :global(.column-2) {
    grid-column: 2;
  }
  .selection-listbox :global(.column-3) {
    grid-column: 3;
  }
</style>
