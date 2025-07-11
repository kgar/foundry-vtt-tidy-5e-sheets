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
  }: Props = $props();

  function change(path: string, delta: number) {
    return actor.update({
      [path]: value + delta,
    });
  }
</script>

<FiligreeCard class="npc-score-tracker">
  <h3>
    {label}
  </h3>
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
        <span data-tooltip={maxTooltip} class="max color-text-default"
          >{max}</span
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
