<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type ActivitySection,
    type Actor5e,
    type CharacterSheetContext,
    type FacilitySection,
  } from 'src/types/types';
  import ItemName from '../../../components/item-list/ItemName.svelte';
  import ItemTable from '../../../components/item-list/v1/ItemTable.svelte';
  import ItemTableCell from '../../../components/item-list/v1/ItemTableCell.svelte';
  import ItemTableColumn from '../../../components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from '../../../components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../../../components/item-list/v1/ItemTableRow.svelte';
  import ItemUseButton from '../../../components/item-list/ItemUseButton.svelte';
  import { getContext, tick } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { Item5e } from 'src/types/item.types';
  import type { Activity5e } from 'src/foundry/dnd5e.types';
  import { Activities } from 'src/features/activities/activities';
  import TidyTable from 'src/components/table/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';
  import TidyTableRow from 'src/components/table/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table/TidyTableCell.svelte';
  import ActivityUses from 'src/components/item-list/ActivityUses.svelte';
  import ItemUses from 'src/components/item-list/ItemUses.svelte';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  export let section: ActivitySection;
  export let activities: Activity5e[];

  const gridTemplateColumns = `
    /* Name */
    1fr
    /* Item Source */
    7rem
    /* Uses */
    2.5rem
    /* Usage */
    5rem
    /* Mod/Save */
    3.25rem
  `;

  const localize = FoundryAdapter.localize;

  function activityHasUses(activity: Activity5e) {
    return (activity.consumption?.targets ?? []).some(
      (t: any) => (t.value ?? 0) > 0 && t.type === 'activityUses',
    );
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<TidyTable
  key={section.key}
  class="favorite-activities"
  --grid-template-columns={gridTemplateColumns}
>
  <svelte:fragment slot="header">
    <TidyTableHeaderRow>
      <TidyTableHeaderCell primary={true}>
        {localize(section.label ?? 'DND5E.Effect')}
      </TidyTableHeaderCell>
      <TidyTableHeaderCell>
        {localize('DOCUMENT.Item')}
      </TidyTableHeaderCell>
      <TidyTableHeaderCell>
        <i class="fas fa-bolt" />
      </TidyTableHeaderCell>
      <TidyTableHeaderCell>
        {localize('DND5E.Usage')}
      </TidyTableHeaderCell>
      <TidyTableHeaderCell>
        <i class="fas fa-wand-sparkles"></i>
        <i class="fas fa-shield"></i>
      </TidyTableHeaderCell>
    </TidyTableHeaderRow>
  </svelte:fragment>
  <svelte:fragment slot="body">
    {#each activities as activity (activity.uuid)}
      <TidyTableRow>
        <!-- TODO: Have a look at inline activities list table styles and maybe just use that. -->
        <TidyTableCell
          primary={true}
          attributes={{
            'data-activity-id': activity.id,
            'data-configurable': Activities.isConfigurable(activity),
          }}
        >
          <a
            class="item-table-image-button"
            on:click={(event) => $context.editable && activity.use({ event })}
          >
            <img src={activity.img} />
            <i class="fa fa-dice-d20 roll-indicator" />
          </a>

          <span
            class="truncate"
            data-tidy-activity-name={activity.name}
            data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
          >
            {activity.name}
          </span>
        </TidyTableCell>
        <TidyTableCell>
          <a
            class="truncate align-self-stretch align-content-center flex-1"
            class:highlight-on-hover={$context.editable}
            on:click={(ev) =>
              $context.editable && activity.item.sheet.render(true)}
          >
            {activity.item.name}
          </a>
        </TidyTableCell>
        <TidyTableCell>
          {@const hasActivityUses = activityHasUses(activity)}
          {#if hasActivityUses}
            <ActivityUses {activity}></ActivityUses>
          {:else}
            <span>—</span>
          {/if}
        </TidyTableCell>
        <TidyTableCell>
          {#if activity.activation?.type}
            <span class="truncate">
              {activity.activationLabels?.activation ?? ''}
            </span>
          {/if}
        </TidyTableCell>
        <TidyTableCell>
          {@const label = activity.labels.toHit ?? activity.labels.save ?? '—'}

          <span class="truncate" title={label}>
            {label}
          </span>
        </TidyTableCell>
      </TidyTableRow>
    {/each}
  </svelte:fragment>
</TidyTable>
