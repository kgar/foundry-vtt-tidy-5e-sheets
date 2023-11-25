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

  let context = getContext<Readable<ActorSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<!-- Make takes from action data -->
{#each Object.entries($context.actions) as [actionType, itemSet] (actionType)}
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
          <ItemTableColumn baseWidth="1.5rem"
            ><!-- Item Table Controls --></ItemTableColumn
          >
        {/if}
      </ItemTableHeaderRow>
      {#each itemSet as item (item.id)}
        <ItemTableRow
          {item}
          on:mousedown={(event) =>
            FoundryAdapter.editOnMiddleClick(event.detail, item)}
          let:toggleSummary
        >
          <!-- TODO: Put the correct itemCardContentTemplate attr on ItemTableRow; it should switch on item type and fall back to the standard -->
          <!-- TODO: Consider having this item card logic be universal and built into the ItemTableRow -->
          <ItemTableCell primary={true}>
            <ItemName {item} on:toggle={() => toggleSummary($context.actor)}>
              <div>
                {item.name}
                <br />
                <small>
                  {#if item.type !== CONSTANTS.ITEM_TYPE_SPELL}
                    {item.labels.type}
                  {/if}
                  {#if item.type === 'spell' && item.system.level !== 0}
                    {item.labels.level ?? ''} {item.labels.school ?? ''}
                  {:else}
                    {item.labels.school ?? ''} {item.labels.level ?? ''}
                  {/if}
                </small>
                <p>What's up?</p>
              </div>

              <!-- 
                TODO: Implement this block starting with 
                {{#if (or item.system.recharge.value item.hasLimitedUses (eq item.system.activation.type "legendary"))}}
              -->
            </ItemName>
          </ItemTableCell>
          <ItemTableCell baseWidth="4.375rem">
            <!-- Range -->
            {#if item.system.target.type === 'self'}
              <span title={item.labels.target}>{item.labels.target}</span>
            {:else}
              <span title={item.labels.range}>{item.labels.range}</span>
              {#if item.labels.target}
                <small title={item.labels.target}>
                  {item.labels.target}
                </small>
              {/if}
            {/if}
          </ItemTableCell>
          <ItemTableCell baseWidth="3.75rem">
            <!-- HIT / DC -->
            {#if item.labels.save || item.labels.toHit}
              {#if item.labels.save !== '' && item.labels.save !== undefined}
                <span title={item.labels.save}>
                  {localize('DND5E.AbbreviationDC')}
                  {item.system.save.dc}
                </span>
                <!-- <small>{lookup @root/abilities system.save.ability}</small> -->
              {:else}
                <span title={item.labels.toHit}>{item.labels.toHit}</span>
              {/if}
            {/if}
          </ItemTableCell>
          <ItemTableCell baseWidth="7.5rem">
            <!-- Damage -->
          </ItemTableCell>
          {#if $context.owner && $context.useClassicControls}
            <ItemTableCell baseWidth="1.5rem">
              <!-- Item Table Controls -->
            </ItemTableCell>
          {/if}
        </ItemTableRow>
      {/each}
    </ItemTable>
  {/if}
{/each}
