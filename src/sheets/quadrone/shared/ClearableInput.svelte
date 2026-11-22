<script lang="ts">
  import { isNil } from 'src/utils/data';
  import { tick } from 'svelte';
  import type { ClassValue, HTMLInputAttributes } from 'svelte/elements';

  type Props = HTMLInputAttributes & {
    tag?: keyof HTMLElementTagNameMap;
    icon?: ClassValue;
    containerClass?: ClassValue;
  };

  let {
    tag = 'span',
    icon,
    value = $bindable(),
    containerClass,
    ...attributes
  }: Props = $props();

  let input: HTMLInputElement;

  async function OnClearClicked() {
    value = '';

    await tick();

    input.dispatchEvent(
      new Event('change', { bubbles: true, cancelable: true }),
    );
  }
</script>

<svelte:element this={tag} class={['clearable-input', containerClass]}>
  <span class="icon-and-input">
    {#if icon}
      <i class={['fa-fw', icon]}></i>
    {/if}
    <input bind:this={input} {...attributes} bind:value />
  </span>
  {#if !isNil(value, '') && !attributes.disabled && !attributes.readonly && !attributes.inert}
    <a class="clear-input" onclick={OnClearClicked}>
      <i class="fas fa-xmark-large fa-fw"></i>
    </a>
  {/if}
</svelte:element>
