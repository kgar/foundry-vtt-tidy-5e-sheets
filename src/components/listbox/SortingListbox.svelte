<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Listbox from './Listbox.svelte';

  export let items: any[];
  export let selectedItemIndex: number | null = null;
  export let labelProp: string;
  export let valueProp: string;

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

  const localize = FoundryAdapter.localize;
</script>

<div class="flex-row small-gap {$$restProps.class ?? ''}">
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
    class="flex-1"
  />
</div>

<style lang="scss">
    .controls {
        align-self: center;
        
        button + button {
            margin-top: 0.25rem;
        }
    }

</style>
