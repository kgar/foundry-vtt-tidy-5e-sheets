<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActiveEffect5e } from 'src/types/types';
  import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';

  interface Props {
    activeEffect: ActiveEffect5e;
  }

  let { activeEffect }: Props = $props();

  let descriptionPromise = $derived(
    FoundryAdapter.enrichHtml(activeEffect.description ?? ''),
  );

  let pills = $derived.by(() => {
    let result = [];

    if (activeEffect.disabled) {
      result.push('EFFECT.Disabled');
    }

    if (activeEffect.transfer) {
      result.push('EFFECT.Transfer');
    }

    if (activeEffect.isSuppressed) {
      result.push('DND5E.Suppressed');
    }

    Array.from<string>(activeEffect.statuses)
      .map(
        (x: string) => CONFIG.statusEffects.find((y) => y.id === x)?.name ?? x,
      )
      .forEach((e) => {
        result.push(e);
      });

    return result;
  });

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

<div
  class="item-summary"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_SUMMARY}
>
  {#await descriptionPromise then description}
    {@html description}
    <HorizontalLineSeparator />
    <ul style="margin-block-start: 1rem;" class="unlist flex-column small-gap">
      {#each activeEffect.changes as change}
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
    <div
      class="inline-wrapped-elements"
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_PROPERTY_LIST}
    >
      {#each pills as pill}<span class="tag">{pill}</span>{/each}
    </div>
  {/await}
</div>
