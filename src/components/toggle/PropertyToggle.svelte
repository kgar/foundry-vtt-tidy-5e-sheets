<script lang="ts">
  import { run } from 'svelte/legacy';

  import TidySwitch from './TidySwitch.svelte';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { debug, error } from 'src/utils/logging';

  interface Props {
    document: any;
    field: string;
    checked: boolean;
    title?: string;
    disabled?: boolean;
    iconSrc?: string | null;
    iconClass?: string | null;
    children?: import('svelte').Snippet;
  }

  let {
    document,
    field,
    checked,
    title = '',
    disabled = false,
    iconSrc = null,
    iconClass = null,
    children,
  }: Props = $props();

  let switchOn: boolean = $state(checked);

  run(() => {
    switchOn = checked;
  });

  async function handleChange(newValue: boolean) {
    try {
      const result = await document.update({
        [field]: newValue,
      });
      if (!result) {
        switchOn = !newValue;
      }
    } catch (e) {
      error('An error occurred while toggling a property', false, e);
      debug('Property toggle error troubleshooting info', {
        originalValue: !newValue,
        state: switchOn,
      });
      switchOn = !newValue;
    }
  }
</script>

<TidySwitch
  class="flex-row small-gap tidy-property-toggle {switchOn
    ? 'active'
    : 'inactive'}"
  bind:checked={switchOn}
  on:change={(ev) => handleChange(ev.detail.currentTarget.checked)}
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
