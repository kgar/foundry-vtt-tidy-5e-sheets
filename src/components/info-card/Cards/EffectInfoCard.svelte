<script lang="ts">
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActiveEffect5e } from 'src/types/types';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';

  interface Props {
    activeEffect: ActiveEffect5e;
  }

  let { activeEffect }: Props = $props();

  let enrichedDescriptionPromise = $derived(
    FoundryAdapter.enrichHtml(activeEffect.description ?? '', {
      secrets: activeEffect.isOwner,
      relativeTo: activeEffect,
      rollData: {},
    }),
  );

  let pills = $derived.by(() =>
    ActiveEffectsHelper.getActiveEffectPills(activeEffect),
  );

  const localize = FoundryAdapter.localize;
</script>

<header>
  {activeEffect.name}
</header>

<div class="info-card-content">
  <div class="info-card-states">
    <span>{activeEffect.parent?.name}</span>
  </div>
  <HorizontalLineSeparator borderColor="faint" />
  <div class="info-card-states">
    <span>
      <i class="fa-regular fa-clock"></i>
      {activeEffect.duration?.seconds ?? '—'}
    </span>
    <span>
      {#if activeEffect.type === 'enchantment'}
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
      {#each activeEffect.changes as change}
        {@const modeLabel = ActiveEffectsHelper.findMode(change.mode)}
        <li>
          <div>
            <strong class="break-word">{change.key}</strong>
          </div>
          <div>
            <span>{modeLabel}</span>
            <span class="text-body-tertiary break-word">|</span>
            {change.value}
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
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
