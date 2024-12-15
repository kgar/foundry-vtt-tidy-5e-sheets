<script lang="ts">
  import TidySwitch from './TidySwitch.svelte';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { debug, error } from 'src/utils/logging';
  import type { Snippet } from 'svelte';

  interface Props {
    document: any;
    field: string;
    checked: boolean;
    title?: string;
    disabled?: boolean;
    iconSrc?: string | null;
    iconClass?: string | null;
    children?: Snippet;
  }

  let {
    document,
    field,
    checked = $bindable(false),
    title = '',
    disabled = false,
    iconSrc = null,
    iconClass = null,
    children,
  }: Props = $props();

  async function handleChange(newValue: boolean) {
    try {
      const result = await document.update({
        [field]: newValue,
      });
    } catch (e) {
      error('An error occurred while toggling a property', false, e);
      debug('Property toggle error troubleshooting info', {
        originalValue: !newValue,
        state: checked,
      });
    }
  }
</script>

<TidySwitch
  class="flex-row small-gap tidy-property-toggle {checked
    ? 'active'
    : 'inactive'}"
  bind:checked
  onChange={(ev) => handleChange(ev.currentTarget.checked)}
  {title}
  {disabled}
>
  {#if iconSrc}
    <Dnd5eIcon src={iconSrc} />
  {/if}
  {#if iconClass}
    <i class={iconClass}></i>
  {/if}
  {@render children?.()}
</TidySwitch>
