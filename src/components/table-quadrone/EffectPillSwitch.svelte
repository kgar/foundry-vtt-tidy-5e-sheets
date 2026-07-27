<script lang="ts">
  import FieldToggle from 'src/components/toggles/FieldToggle.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActiveEffect5e } from 'src/types/types';

  interface Props {
    effect: ActiveEffect5e;
    categoryLabel: string;
    enabled: boolean;
    disabled?: boolean;
  }

  let { effect, categoryLabel, enabled, disabled = false }: Props = $props();

  const localize = FoundryAdapter.localize;

  let toggleTitle = $derived(
    localize(enabled ? 'DND5E.EffectDisable' : 'DND5E.EffectEnable'),
  );
</script>

{#snippet contents()}
  <img
    class="effect-pill-image"
    src={effect.img ?? effect.icon}
    alt={effect.name ?? ''}
  />
  <span class="truncate">
  {effect.name}
  </span>
  <span class="effect-pill-category color-text-lighter">
    ({localize(categoryLabel)})
  </span>
{/snippet}

{#if disabled}
  <span class="pill effect-pill">
    {@render contents()}
  </span>
{:else}
  <label class="pill pill-switch interactive effect-pill" title={toggleTitle}>
    <span class="icon-and-label-container">
      {@render contents()}
    </span>
    <FieldToggle
      checked={enabled}
      onchange={(ev) => effect.update({ disabled: !ev.currentTarget.checked })}
    />
  </label>
{/if}
