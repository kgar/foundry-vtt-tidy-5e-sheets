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

  let locKeys = {
    key: 'EFFECT.FIELDS.changes.element.key.label',
    mode: 'EFFECT.FIELDS.changes.element.type.label',
    value: 'EFFECT.FIELDS.changes.element.value.label',
  };

  const localize = FoundryAdapter.localize;
</script>

<div
  class="editor-rendered-content"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_SUMMARY}
>
  {@html summaryData.description.value}

  {#if summaryData.changes.length}
    <table class="effect-summary-changes-table">
      <colgroup>
        <col width="50%" />
        <col width="20%" />
        <col width="30%" />
      </colgroup>
      <thead>
        <tr>
          <th>
            {localize(locKeys.key)}
          </th>
          <th>
            {localize(locKeys.mode)}
          </th>
          <th>
            {localize(locKeys.value)}
          </th>
        </tr>
      </thead>
      <tbody>
        {#each summaryData.changes as change}
          {const modeLabel = $derived(ActiveEffectsHelper.findMode(change))}
          {const modeIcon = $derived(ActiveEffectsHelper.findModeIcon(change))}

          <tr>
            <td
              title={change.key}
              class="truncate"
              style="word-wrap: break-all"
            >
            <span class="effect-label flexcol">
              {#if change.name !== change.key}
              <span class="effect-change-key">{change.key}</span>
              {/if}
              <span class="effect-change-name font-label-small color-text-gold-emphasis">{change.name}</span>
            </span>
            </td>
            <td>
              {#if modeIcon}
                <i class="fa-solid {modeIcon} effect-change-mode-icon color-text-lightest" aria-hidden="true"></i>
              {/if}
              <span class="effect-change-mode-label font-label-medium">{modeLabel}</span>
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
      {#each pills as pill}<span
          class="tag"
          data-tooltip={pill.tooltip ? localize(pill.tooltip) : undefined}
          >{localize(pill.label)}</span
        >{/each}
    </div>
  {/if}
</div>
