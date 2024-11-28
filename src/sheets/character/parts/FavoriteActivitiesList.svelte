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
  import InlineActivitiesList from 'src/components/item-list/InlineActivitiesList.svelte';
  import InlineToggleControl from 'src/sheets/shared/InlineToggleControl.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService';
  import type { Item5e } from 'src/types/item.types';
  import FacilityOrderProgressMeter from './FacilityOrderProgressMeter.svelte';
  import { Tooltip } from 'src/tooltips/Tooltip';
  import OccupantSummaryTooltip from 'src/tooltips/OccupantSummaryTooltip.svelte';
  import type { Activity5e } from 'src/foundry/dnd5e.types';
  import { Activities } from 'src/features/activities/activities';
  import TidyTable from 'src/components/table/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';
  import TidyTableRow from 'src/components/table/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table/TidyTableCell.svelte';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  export let section: ActivitySection;
  export let activities: Activity5e[];

  const localize = FoundryAdapter.localize;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<TidyTable key={section.key} class="favorite-activities">
  <svelte:fragment slot="header">
    <TidyTableHeaderRow>
      <TidyTableHeaderCell primary={true}>
        {localize(section.label ?? 'DND5E.Effect')}
      </TidyTableHeaderCell>
    </TidyTableHeaderRow>
  </svelte:fragment>
  <svelte:fragment slot="body">
    {#each activities as activity (activity.uuid)}
      <TidyTableRow>
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
      </TidyTableRow>
    {/each}
  </svelte:fragment>
</TidyTable>
