<script lang="ts">
  import type { DropdownListOption } from 'src/types/types';
  import { createEventDispatcher } from 'svelte';
  import ButtonMenu from '../button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from '../button-menu/ButtonMenuCommand.svelte';

  export let options: DropdownListOption[];
  export let selected: DropdownListOption;
  export let isOpen = false;
  export let title: string | null = null;
  export let buttonClass: string = '';

  const dispatch = createEventDispatcher<{
    optionClicked: DropdownListOption;
  }>();

  function optionClicked(selection: DropdownListOption): void {
    dispatch('optionClicked', { ...selection });
    isOpen = false;
  }
</script>

<ButtonMenu
  position="bottom"
  ariaLabel={title}
  {title}
  buttonText={selected.text}
  buttonClass="primary {buttonClass}"
  buttonStyle="transparent-inline"
>
  {#each options as option}
    <ButtonMenuCommand
      useIconColumn={false}
      on:click={() => optionClicked(option)}
      size="compact"
    >
      {option.text}
    </ButtonMenuCommand>
  {/each}
</ButtonMenu>
