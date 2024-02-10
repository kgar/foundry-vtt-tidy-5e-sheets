<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let items: any[];
  export let labelProp: string;
  export let valueProp: string;
  export let selectedItemIndex: number | null = null;

  let idRandomizer = Math.random().toString().substring(2);

  const dispatcher = createEventDispatcher<{
    select: number;
    keydown: KeyboardEvent & { currentTarget: HTMLElement };
  }>();

  let listbox: HTMLElement;

  function handleListboxKeyDown(
    ev: KeyboardEvent & { currentTarget: HTMLElement },
  ) {
    if (items.length) {
      const currentIndex = selectedItemIndex ?? -1;

      if (ev.key === 'ArrowUp' && !ev.altKey) {
        selectItemAt(Math.max(0, currentIndex - 1));
        ev.preventDefault();
      } else if (ev.key === 'ArrowDown' && !ev.altKey) {
        selectItemAt(Math.min(items.length - 1, currentIndex + 1));
        ev.preventDefault();
      } else if (ev.key === 'Home') {
        selectItemAt(0);
        ev.preventDefault();
      } else if (ev.key === 'End') {
        selectItemAt(items.length - 1);
        ev.preventDefault();
      }

      listbox
        .querySelector(`#listbox-item-${selectedItemIndex}-${idRandomizer}`)
        ?.scrollIntoView({ block: 'nearest' });
    }

    dispatcher('keydown', ev);
  }

  function selectItemAt(index: number) {
    selectedItemIndex = index;
    dispatcher('select', index);
  }
</script>

<ul
  bind:this={listbox}
  role="listbox"
  class="listbox {$$props.class ?? ''}"
  aria-activedescendant={selectedItemIndex !== null
    ? `listbox-item-${selectedItemIndex}-${idRandomizer}`
    : null}
  tabindex="0"
  on:keydown={handleListboxKeyDown}
>
  {#each items as item, i (item[valueProp])}
    <li
      id="listbox-item-{i}-{idRandomizer}"
      role="option"
      aria-selected={selectedItemIndex === i}
      class:focused={selectedItemIndex === i}
      on:click={() => selectItemAt(i)}
      on:keydown={(ev) => handleListboxKeyDown(ev)}
    >
      {item[labelProp]}
    </li>
  {/each}
</ul>

<style lang="scss">
  ul.listbox {
    margin: 0;
    padding: 0;
    border: 0.0625rem solid var(--t5e-light-color);
    overflow-y: auto;
    max-height: inherit;
    height: 100%;

    &:focus-visible {
      outline: 1px solid var(--t5e-primary-accent-color);
    }
  }
  .listbox li {
    list-style-type: none;
    padding: 0.5rem;
  }
  .listbox [role='option'].focused {
    background-color: var(--t5e-faint-color);
  }

  .listbox [role='option']:hover {
    background: var(--t5e-faintest-color);
  }

  .listbox [role='option'].focused:hover {
    background-color: var(--t5e-faint-color);
  }
</style>
