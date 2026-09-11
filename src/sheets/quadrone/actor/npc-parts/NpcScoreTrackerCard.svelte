<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { isNil } from 'src/utils/data';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let localize = FoundryAdapter.localize;

  interface Props {
    label: string;
    min?: number;
    value: number;
    valuePath?: string;
    valueTooltip?: string;
    max?: number;
    maxPath?: string;
    maxTooltip?: string;
    unlocked?: boolean;
    showFiligree?: boolean;
    icon?: string;
  }

  let {
    label,
    min = 0,
    value = 0,
    valuePath,
    valueTooltip,
    max,
    maxPath,
    maxTooltip,
    unlocked = true,
    showFiligree = true,
    icon = 'dragon',
  }: Props = $props();
</script>

{#snippet tracker()}
  {#if valuePath}
    <button
      type="button"
      class="button button-icon-only button-borderless flexshrink decrementer"
      disabled={value <= min}
      aria-label={localize('TIDY5E.Decrease')}
      data-action="decrease"
      data-property={valuePath}
    >
      <i class="fa-solid fa-hexagon-minus"></i>
    </button>
  {/if}
  <span
    class={[
      'uses',
      'flexrow',
      {
        flex1: unlocked && !showFiligree,
        flexshrink: !unlocked && !showFiligree,
      },
    ]}
  >
    {#if valuePath}
      <input
        type="text"
        inputmode="numeric"
        placeholder="0"
        data-min="0"
        class={['value', { uninput: !unlocked }]}
        data-tooltip=""
        aria-label={valueTooltip}
        data-name={valuePath}
        {value}
        {@attach InputAttachments.selectOnFocus}
      />
    {:else}
      <span
        data-tooltip={valueTooltip}
        class={[
          'value',
          'color-text-default',
          {
            ['font-label-large']: !showFiligree,
          },
        ]}>{value}</span
      >
    {/if}
    <span class="separator color-text-lightest flexshrink">/</span>
    {#if maxPath && unlocked}
      <input
        type="text"
        inputmode="numeric"
        placeholder="0"
        data-min="0"
        class={{ uninput: !unlocked }}
        data-tooltip=""
        aria-label={maxTooltip}
        data-name={maxPath}
        value={max}
        {@attach InputAttachments.selectOnFocus}
      />
    {:else}
      <span
        data-tooltip={maxTooltip}
        class="max color-text-default font-label-large">{max}</span
      >
    {/if}
  </span>
  {#if valuePath}
    <button
      type="button"
      class="button button-icon-only button-borderless flexshrink decrementer"
      disabled={!isNil(max) && value >= max}
      aria-label={localize('TIDY5E.Increase')}
      data-action="increase"
      data-property={valuePath}
    >
      <i class="fa-solid fa-hexagon-plus"></i>
    </button>
  {/if}
{/snippet}

{#if showFiligree}
  <div class="npc-score-tracker card">
    <div class="card-header flexrow">
      <h3>
        {label}
      </h3>
    </div>
    <div class="card-content flexrow">
      {@render tracker()}
    </div>
  </div>
{:else}
  <div class="npc-score-tracker list-entry">
    <h4 class="font-label-medium bordered">
      <i class={`fa-solid fa-${icon} color-icon-button`}></i>
      {label}
    </h4>
    <div class="flexrow">
      {@render tracker()}
    </div>
  </div>
{/if}
