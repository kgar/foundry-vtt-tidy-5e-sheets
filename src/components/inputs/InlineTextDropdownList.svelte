<script lang="ts">
  import type { DropdownListOption } from 'src/types/types';
  import ButtonMenu from '../button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from '../button-menu/ButtonMenuCommand.svelte';

  interface Props {
    options: DropdownListOption[];
    selected: DropdownListOption;
    isOpen?: boolean;
    title?: string | null;
    buttonClass?: string;
    onOptionClicked: (option: DropdownListOption) => void;
  }

  let {
    options,
    selected,
    isOpen = $bindable(false),
    title = null,
    buttonClass = '',
    onOptionClicked,
  }: Props = $props();

  function optionClicked(selection: DropdownListOption): void {
    onOptionClicked?.({ ...selection });
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
