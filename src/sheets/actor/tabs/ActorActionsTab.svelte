<script lang="ts">
  import ItemTable from 'src/components/item-list/ItemTable.svelte';
  import ItemTableColumn from 'src/components/item-list/ItemTableColumn.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/ItemTableHeaderRow.svelte';
  import ItemTableRow from 'src/components/item-list/ItemTableRow.svelte';
  import ItemTableCell from 'src/components/item-list/ItemTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemName from 'src/components/item-list/ItemName.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import {
    damageTypeIconMap,
    getScaledCantripDamageFormulaForSinglePart,
  } from 'src/features/actions/actions';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import ActionFilterOverrideControl from 'src/components/item-list/controls/ActionFilterOverrideControl.svelte';
  import { settingStore } from 'src/settings/settings';

  let context = getContext<Readable<ActorSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<div class="actions-tab-container scroll-container flex-column small-gap">
  {#each Object.entries($context.actionsV2) as [actionType, itemSet] (actionType)}
    {#if itemSet.size}
      <ItemTable>
        <ItemTableHeaderRow>
          <ItemTableColumn primary={true}>
            {FoundryAdapter.getActivationTypeLabel(actionType)}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="4.375rem"
            >{localize('DND5E.Range')}</ItemTableColumn
          >
          <ItemTableColumn baseWidth="3.75rem"
            >{localize('T5EK.HitDC')}</ItemTableColumn
          >
          <ItemTableColumn baseWidth="7.5rem"
            >{localize('DND5E.Damage')}</ItemTableColumn
          >
          {#if $context.owner && $context.useClassicControls}
            <ItemTableColumn baseWidth="1.5rem"></ItemTableColumn>
          {/if}
        </ItemTableHeaderRow>
        {#each itemSet as actionItem (actionItem.item.id)}
          <ItemTableRow
            item={actionItem.item}
            on:mousedown={(event) =>
              FoundryAdapter.editOnMiddleClick(event.detail, actionItem.item)}
            contextMenu={{
              type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
              id: actionItem.item.id,
            }}
            let:toggleSummary
          >
            <ItemTableCell primary={true}>
              <ItemUseButton item={actionItem.item} />
              <ItemName
                item={actionItem.item}
                on:toggle={() => toggleSummary($context.actor)}
                useActiveEffectsMarker={false}
              >
                {@const spellClass = FoundryAdapter.getClassLabel(
                  FoundryAdapter.tryGetFlag(actionItem.item, 'parentClass') ??
                    '',
                )}
                <div class="flex-1">
                  <div>{actionItem.item.name}</div>

                  <small>
                    {#if actionItem.item.type !== CONSTANTS.ITEM_TYPE_SPELL}
                      {actionItem.typeLabel}
                    {:else if actionItem.item.type === 'spell' && actionItem.item.system.level !== 0}
                      {actionItem.item.labels.level ?? ''}
                      {actionItem.item.labels.school ?? ''}
                      {#if spellClass}
                        • {localize(spellClass)}
                      {/if}
                    {:else}
                      {actionItem.item.labels.school ?? ''}
                      {actionItem.item.labels.level ?? ''}
                      {#if spellClass}
                        • {localize(spellClass)}
                      {/if}
                    {/if}
                  </small>
                </div>
              </ItemName>
              {#if actionItem.item.system.recharge?.value || actionItem.item.hasLimitedUses || actionItem.item.system.activation?.type === 'legendary'}
                <div class="item-uses" title={localize('DND5E.Uses')}>
                  {#if actionItem.item.system.recharge?.charged && actionItem.item.system.recharge?.value}
                    <i class="fas fa-bolt" title={localize('DND5E.Charged')} />
                  {:else if actionItem.item.system.recharge?.value}
                    <RechargeControl item={actionItem.item} />
                  {:else if actionItem.item.hasLimitedUses}
                    {#if actionItem.item.system.uses?.value === actionItem.item.system.uses?.max && actionItem.item.system.uses?.autoDestroy}
                      <div title={actionItem.item.system.quantity}>
                        {actionItem.item.system.quantity ?? 0}
                      </div>
                      <small>{localize('DND5E.Quantity')}</small>
                    {:else}
                      <div>
                        {actionItem.item.system.uses.value ?? 0} / {actionItem
                          .item.system.uses.max ?? 0}
                      </div>
                      <small>{localize('DND5E.Uses')}</small>
                    {/if}
                  {/if}

                  {#if actionItem.item.system.activation.type === 'legendary'}
                    {actionItem.item.system.activation.cost}
                  {/if}
                </div>
              {/if}
            </ItemTableCell>
            <ItemTableCell
              baseWidth="4.375rem"
              cssClass="truncate flex-column no-gap"
            >
              <!-- Range -->
              {#if actionItem.item.system.target?.type === 'self'}
                <div
                  title={actionItem.item.labels.target}
                  class="flex-column-truncate"
                >
                  {actionItem.item.labels.target}
                </div>
              {:else}
                <div
                  title={actionItem.item.labels.range}
                  class="flex-column-truncate"
                >
                  {actionItem.item.labels.range}
                </div>
                {#if actionItem.item.labels.target}
                  <small
                    title={actionItem.item.labels.target}
                    class="flex-column-truncate"
                    style="min-width: 0; "
                  >
                    {actionItem.item.labels.target}
                  </small>
                {/if}
              {/if}
            </ItemTableCell>
            <ItemTableCell baseWidth="3.75rem" cssClass="flex-column no-gap">
              <!-- HIT / DC -->
              {#if actionItem.item.labels.save || actionItem.item.labels.toHit}
                {#if actionItem.item.labels.save !== '' && actionItem.item.labels.save !== undefined}
                  {@const saveAbilityLabel =
                    FoundryAdapter.lookupAbility(
                      actionItem.item.system.save.ability,
                    )?.label ?? ''}
                  <span
                    title={actionItem.item.labels.save}
                    class="flex-column-truncate"
                  >
                    {localize('DND5E.AbbreviationDC')}
                    {actionItem.item.system.save.dc}
                  </span>
                  <small title={saveAbilityLabel} class="flex-column-truncate"
                    >{saveAbilityLabel}</small
                  >
                {:else}
                  <span title={actionItem.item.labels.toHit}
                    >{actionItem.item.labels.toHit}</span
                  >
                {/if}
              {/if}
            </ItemTableCell>
            <ItemTableCell baseWidth="7.5rem" cssClass="flex-wrap">
              <!-- Damage -->
              {#each actionItem.calculatedDerivedDamage ?? [] as entry, i}
                {@const damageHealingTypeLabel =
                  FoundryAdapter.lookupDamageType(entry.damageType) ??
                  FoundryAdapter.lookupHealingType(entry.damageType)}
                {@const isScalableCantripDamage =
                  actionItem.item.type === 'spell' &&
                  actionItem.item.system.scaling?.mode === 'cantrip' &&
                  $settingStore.actionListScaleCantripDamage}

                {#if isScalableCantripDamage}
                  {@const scaledEntry =
                    getScaledCantripDamageFormulaForSinglePart(
                      actionItem.item,
                      i,
                    )}
                  <p title={scaledEntry.formula + damageHealingTypeLabel}>
                    {scaledEntry.formula}
                    <span
                      >{@html damageTypeIconMap[scaledEntry.damageType] ??
                        ''}</span
                    >
                  </p>
                {:else}
                  <p
                    title={entry.label ??
                      entry.formula + damageHealingTypeLabel}
                  >
                    {entry.formula}
                    <span
                      >{@html damageTypeIconMap[entry.damageType] ?? ''}</span
                    >
                  </p>
                {/if}
              {/each}
            </ItemTableCell>
            {#if $context.owner && $context.useClassicControls}
              <ItemTableCell baseWidth="1.5rem">
                <ActionFilterOverrideControl item={actionItem.item} />
              </ItemTableCell>
            {/if}
          </ItemTableRow>
        {/each}
      </ItemTable>
    {/if}
  {/each}
</div>

<style lang="scss">
  .actions-tab-container {
    --t5ek-image-size-override: 2rem;

    :global(.item-table-row) {
      min-height: 2rem;
    }
  }

  .flex-column-truncate {
    text-align: center;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-uses {
    align-self: center;
    text-align: center;
    flex-basis: 4.25rem;
  }

  small {
    color: var(--t5ek-tertiary-color);
  }
</style>
