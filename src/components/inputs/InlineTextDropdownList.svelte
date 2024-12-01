<script lang="ts">
  import type { DropdownListOption } from 'src/types/types';
  import { createEventDispatcher } from 'svelte';
  import ButtonMenu from '../button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from '../button-menu/ButtonMenuCommand.svelte';

  interface Props {
    options: DropdownListOption[];
    selected: DropdownListOption;
    isOpen?: boolean;
    title?: string | null;
    buttonClass?: string;
  }

  let {
    options,
    selected,
    isOpen = $bindable(false),
    title = null,
    buttonClass = '',
  }: Props = $props();

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
      onMenuClick={() => optionClicked(option)}
      size="compact"
    >
      {option.text}
    </ButtonMenuCommand>
  {/each}
</ButtonMenu>
