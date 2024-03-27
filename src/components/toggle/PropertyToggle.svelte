<script lang="ts">
  import TidySwitch from './TidySwitch.svelte';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { debug, error } from 'src/utils/logging';

  export let document: any;
  export let field: string;
  export let checked: boolean;
  export let title: string = '';
  export let disabled: boolean = false;
  export let iconSrc: string | null = null;
  export let iconClass: string | null = null;

  let switchOn: boolean = checked;

  $: {
    switchOn = checked;
  }

  async function handleChange(originalValue: boolean) {
    try {
      document.update({
        [field]: !originalValue,
      });
    } catch (e) {
      error('An error occurred while toggling a property', false, e);
      debug('Property toggle error troubleshooting info', {
        originalValue,
        state: switchOn,
      });
      switchOn = originalValue;
    }
  }
</script>

<TidySwitch
  class="flex-row small-gap tidy-property-toggle {switchOn
    ? 'active'
    : 'inactive'}"
  bind:value={switchOn}
  on:change={(ev) => handleChange(ev.detail.originalValue)}
  {title}
  {disabled}
>
  {#if iconSrc}
    <Dnd5eIcon src={iconSrc} />
  {/if}
  {#if iconClass}
    <i class={iconClass}></i>
  {/if}
  <slot />
</TidySwitch>
