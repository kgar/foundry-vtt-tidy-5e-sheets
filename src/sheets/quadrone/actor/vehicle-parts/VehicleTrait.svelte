<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  type Props = {
    editableValues?: Snippet;
    iconClass?: ClassValue;
    label?: string;
    onconfig?: () => void;
    traitClass?: ClassValue;
    units?: string;
    unlocked?: boolean;
    value?: string;
  };

  let {
    editableValues,
    iconClass,
    label,
    onconfig,
    traitClass,
    units,
    unlocked,
    value,
  }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<div class={['list-entry', traitClass]}>
  <div class="list-label flexrow">
    <h4 class="font-weight-label">
      <i class={iconClass}></i>
      {label}
    </h4>
  </div>
  <div class={['trait-values', { flexrow: unlocked }]}>
    {#if unlocked}
      {@render editableValues?.()}
    {:else}
      <span class="value font-label-medium">{value ?? '—'}</span>
      {#if units}
        <span class="units font-label-medium color-text-lighter">{units}</span
        >
      {/if}
    {/if}

    {#if unlocked && onconfig}
      <button
        aria-label={localize('DND5E.TraitConfig', { trait: label })}
        type="button"
        class="button button-borderless button-icon-only button-config flexshrink"
        data-tooltip
        onclick={onconfig}
      >
        <i class="fa-solid fa-cog"></i>
      </button>
    {/if}
  </div>
</div>
