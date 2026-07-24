<script lang="ts">
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';
  import { clamp } from 'src/utils/numbers';

  interface Props {
    actor: any;
    label: string;
    min?: number;
    spentPath?: string;
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
    value = 0,
    valuePath,
    valueTooltip,
    max,
    maxPath,
    maxTooltip,
    unlocked = true,
    showFiligree = true,
    icon = 'dragon',
    spentPath,
  }: Props = $props();

  function change(path: string, delta: number) {
    if (spentPath && !isNil(max)) {
      value += delta;
      const uses = clamp(0, value, max);
      const spent = max - uses;

      return actor.update({
        [spentPath]: spent,
      });
    }

    return actor.update({
      [path]: value + delta,
    });
  }
</script>

{#if showFiligree}
  <div class="npc-score-tracker card">
    <div class="card-header flexrow">
      <h3>
        {label}
      </h3>
    </div>
    <div class="card-content flexrow">
      {#if valuePath}
        <button
          type="button"
          class="button button-icon-only button-borderless flexshrink decrementer"
          disabled={value <= min}
          onclick={() => change(valuePath, -1)}
        >
          <i class="fa-solid fa-hexagon-minus"></i>
        </button>
      {/if}
      <span class="uses flexrow">
        {#if valuePath}
          <NumberInputQuadrone
            document={actor}
            field={valuePath}
            {value}
            placeholder="0"
            min="0"
            step="1"
            class={['value', { uninput: !unlocked }]}
            data-tooltip={valueTooltip}
            onchange={(ev) => {
              if (spentPath) {
                return FoundryAdapter.handleDocumentUsesChanged(
                  ev,
                  actor,
                  valuePath,
                  spentPath,
                  maxPath,
                );
              }
            }}
          />
        {:else}
          <span data-tooltip={valueTooltip} class="value color-text-default"
            >{value}</span
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
            class={{ uninput: unlocked }}
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
          class="button button-icon-only button-borderless flexshrink decrementer"
          disabled={!isNil(max) && value >= max}
          onclick={() => change(valuePath, 1)}
        >
          <i class="fa-solid fa-hexagon-plus"></i>
        </button>
      {/if}
    </div>
  </div>
{:else}
  <div class="npc-score-tracker list-entry">
    <h4 class="font-label-medium bordered">
      <i class={`fa-solid fa-${icon} color-icon-button`}></i>
      {label}
    </h4>
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
