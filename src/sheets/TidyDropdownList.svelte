<script lang="ts">
  import type { TidyDropdownOption } from 'src/types/types';
  import { createEventDispatcher } from 'svelte';

  export let options: TidyDropdownOption[];
  export let selected: TidyDropdownOption;
  export let isOpen = false;
  export let title: string | null = null;

  const dispatch = createEventDispatcher<{
    optionClicked: TidyDropdownOption;
  }>();

  function optionClicked(selection: TidyDropdownOption): void {
    dispatch('optionClicked', { ...selection });
    isOpen = false;
  }
</script>

<div class="tidy-dropdown-list-container">
  <span
    class="selected-option"
    class:active={isOpen}
    {title}
    on:click={() => (isOpen = !isOpen)}>{selected.text}</span
  >
  <ul class="options-list" class:active={isOpen}>
    {#each options as option}
      <li
        class="option"
        class:selected={option.value === selected.value}
        on:click={() => optionClicked(option)}
      >
        {option.text}
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .tidy-dropdown-list-container {
    position: relative;
    z-index: 1;
  }

  .options-list {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--t5ek-secondary-color);
    color: var(--t5ek-background);
    border-radius: 3px;
    overflow: hidden;
    display: none;

    &.active {
      display: unset;
    }
  }

  .options-list li {
    padding: 2px 4px;

    &:hover {
      background: var(--t5ek-primary-color);
    }

    .selected {
      background: var(--t5ek-primary-accent-color);
    }
  }

  .options-list .selected {
    background: var(--t5ek-primary-accent-color);
  }

  .selected-option:hover,
  .selected-option.active {
    color: var(--t5ek-primary-accent-color);
    cursor: pointer;
  }
</style>
