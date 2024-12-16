<script lang="ts">
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActiveEffect5e } from 'src/types/types';

  interface Props {
    effect: ActiveEffect5e;
  }

  let { effect }: Props = $props();

  let enrichedDescriptionPromise = $derived(
    FoundryAdapter.enrichHtml(effect.description ?? '', {
      secrets: effect.isOwner,
      relativeTo: effect,
      rollData: {},
    }),
  );

  let pills = $derived.by(() => {
    let result = [];

    if (effect.disabled) {
      result.push('EFFECT.Disabled');
    }

    if (effect.transfer) {
      result.push('EFFECT.Transfer');
    }

    if (effect.isSuppressed) {
      result.push('DND5E.Suppressed');
    }

    Array.from<string>(effect.statuses)
      .map(
        (x: string) => CONFIG.statusEffects.find((y) => y.id === x)?.name ?? x,
      )
      .forEach((e) => {
        result.push(e);
      });

    return result;
  });

  $inspect(pills);

  function findMode(mode: number) {
    const entry = Object.entries(CONST.ACTIVE_EFFECT_MODES).find(
      ([_, value]) => value === mode,
    );

    if (!entry) {
      return '—';
    }

    return localize(`EFFECT.MODE_${entry[0]}`);
  }

  const localize = FoundryAdapter.localize;
</script>

<header>
  {effect.name}
</header>

<div class="info-card-content">
  <div class="info-card-states">
    <span>{effect.parent?.name}</span>
  </div>
  <HorizontalLineSeparator borderColor="faint" />
  <div class="info-card-states">
    <span>
      <i class="fa-regular fa-clock"></i>
      {effect.duration?.seconds ?? '—'}
    </span>
    <span>
      {#if effect.type === 'enchantment'}
        <i class="fa-solid fa-wand-sparkles"></i>
        {localize('DND5E.ENCHANTMENT.Label')}
      {/if}
    </span>
  </div>
  <HorizontalLineSeparator borderColor="faint" />
  <div class="description-wrap">
    {#await enrichedDescriptionPromise then description}
      {@html description}
    {/await}

    <ul style="margin-block-start: 1rem;" class="unlist flex-column small-gap">
      {#each effect.changes as change}
        {@const modeLabel = findMode(change.mode)}
        <li>
          <div>
            <strong>{change.key}</strong>
          </div>
          <div>
            <span>{modeLabel}</span>
            <span class="text-body-tertiary">|</span>
            {change.value}
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
<!-- TODO: Key/Mode/Value entries -->
{#if pills.length}
  <HorizontalLineSeparator />
  <div
    class="inline-wrapped-elements"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_PROPERTY_LIST}
  >
    {#each pills as pill}
      <span class="tag">{localize(pill)}</span>
    {/each}
  </div>
{/if}
