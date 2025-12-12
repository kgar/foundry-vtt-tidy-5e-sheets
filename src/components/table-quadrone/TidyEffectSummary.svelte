<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActiveEffect5e, EffectSummaryData } from 'src/types/types';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';

  interface Props {
    activeEffect: ActiveEffect5e;
    summaryData: EffectSummaryData;
  }

  let { activeEffect, summaryData }: Props = $props();

  let pills = $derived.by(() =>
    ActiveEffectsHelper.getActiveEffectPills(activeEffect),
  );

  const localize = FoundryAdapter.localize;
</script>

<div
  class="editor-rendered-content"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_SUMMARY}
>
  {@html summaryData.description.value}

  {#if activeEffect.changes.length}
    <table class="effect-summary-changes-table">
      <colgroup>
        <col width="50%" />
        <col width="25%" />
        <col width="25%" />
      </colgroup>
      <thead>
        <tr>
          <th>
            {localize('EFFECT.ChangeKey')}
          </th>
          <th>
            {localize('EFFECT.ChangeMode')}
          </th>
          <th>
            {localize('EFFECT.ChangeValue')}
          </th>
        </tr>
      </thead>
      <tbody>
        {#each activeEffect.changes as change}
          {@const modeLabel = ActiveEffectsHelper.findMode(change.mode)}

          <tr>
            <td
              title={change.key}
              class="truncate"
              style="word-wrap: break-all"
            >
              {change.key}
            </td>
            <td>
              {modeLabel}
            </td>
            <td title={change.value} class="break-word">
              {change.value}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  {#if pills.length}
    <div
      class="inline-wrapped-elements"
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_PROPERTY_LIST}
    >
      {#each pills as pill}<span class="tag">{localize(pill)}</span>{/each}
    </div>
  {/if}
</div>
