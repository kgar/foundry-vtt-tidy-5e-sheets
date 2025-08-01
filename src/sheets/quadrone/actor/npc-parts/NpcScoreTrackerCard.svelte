<script lang="ts">
  import FiligreeCard from 'src/components/filigree-card/FiligreeCard.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import { isNil } from 'src/utils/data';

  interface Props {
    actor: any;
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
    actor,
    label,
    min = 0,
    value,
    valuePath,
    valueTooltip,
    max,
    maxPath,
    maxTooltip,
    unlocked = true,
    showFiligree = true,
    icon = 'dragon',
  }: Props = $props();

  function change(path: string, delta: number) {
    return actor.update({
      [path]: value + delta,
    });
  }
</script>

{#if showFiligree}
  <FiligreeCard class="npc-score-tracker card">
    <div class="card-header flexrow">
      <h3>
        {label}
      </h3>
    </div>
    <div class="flexrow">
      {#if valuePath}
        <button
          type="button"
          class="flexshrink decrementer"
          disabled={value <= min}
          onclick={() => change(valuePath, -1)}
        >
          <i class="fa-solid fa-hexagon-minus"></i>
        </button>
      {/if}
      <span class="uses">
        {#if valuePath}
          <NumberInputQuadrone
            document={actor}
            field={valuePath}
            {value}
            placeholder="0"
            min="0"
            step="1"
            class="value"
            data-tooltip={valueTooltip}
          />
        {:else}
          <span data-tooltip={valueTooltip} class="value color-text-default"
            >{value}</span
          >
        {/if}
        <span class="separator color-text-lightest">/</span>
        {#if maxPath && unlocked}
          <NumberInputQuadrone
            document={actor}
            field={maxPath}
            value={max}
            placeholder="0"
            min="0"
            step="1"
            data-tooltip={maxTooltip}
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
          class="flexshrink decrementer"
          disabled={!isNil(max) && value >= max}
          onclick={() => change(valuePath, 1)}
        >
          <i class="fa-solid fa-hexagon-plus"></i>
        </button>
      {/if}
    </div>
  </FiligreeCard>
{:else}
  <div class="npc-score-tracker">
    <h3 class="font-label-medium bordered">
      <i class={`fa-solid fa-${icon} color-icon-disabled`}></i>
      {label}
    </h3>
    <div class="flexrow">
      {#if valuePath}
        <button
          type="button"
          class="button button-icon-only button-borderless flexshrink"
          disabled={value <= min}
          onclick={() => change(valuePath, -1)}
        >
          <i class="fa-solid fa-hexagon-minus"></i>
        </button>
      {/if}
      <span class="uses flexrow {unlocked ? 'flex1' : 'flexshrink'}">
        {#if valuePath}
          <NumberInputQuadrone
            document={actor}
            field={valuePath}
            {value}
            placeholder="0"
            min="0"
            step="1"
            class="value {unlocked ? '' : 'uninput'}"
            data-tooltip={valueTooltip}
          />
        {:else}
          <span
            data-tooltip={valueTooltip}
            class="value color-text-default font-label-large">{value}</span
          >
        {/if}
        <span class="separator color-text-lightest flexshrink">/</span>
        {#if maxPath && unlocked}
          <NumberInputQuadrone
            document={actor}
            field={maxPath}
            value={max}
            placeholder="0"
            min="0"
            step="1"
            data-tooltip={maxTooltip}
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
          class="button button-icon-only button-borderless flexshrink"
          disabled={!isNil(max) && value >= max}
          onclick={() => change(valuePath, 1)}
        >
          <i class="fa-solid fa-hexagon-plus"></i>
        </button>
      {/if}
    </div>
  </div>
{/if}
