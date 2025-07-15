<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import TidyTable from './TidyTable.svelte';
  import TidyTableRow from './TidyTableRow.svelte';
  import TidyTableCell from './TidyTableCell.svelte';
  import type { Activity5e } from 'src/foundry/dnd5e.types';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { Activities } from 'src/features/activities/activities';
  import type { ActivityItemContext } from 'src/types/types';
  import ActivityUsesColumn from 'src/sheets/quadrone/item/columns/ActivityUsesColumn.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';

  interface Props {
    item?: Item5e | null;
    activities: ActivityItemContext[] | undefined;
  }

  let { item = null, activities = [] }: Props = $props();

  const columns = $derived({
    uses: {
      columnWidth: '5rem',
    },
    usage: {
      columnWidth: '5rem',
    },
  });

  function rollActivity(activity: Activity5e, event: MouseEvent) {
    activity.use({ event });
  }

  function getActivityUsageLabel(activity: Activity5e) {
    return (
      CONFIG.DND5E.activityActivationTypes[activity.activation?.type]?.label ??
      activity.activation?.type ??
      ''
    );
  }

  const localize = FoundryAdapter.localize;
</script>

<TidyTable
  key="activities-{item.name}"
  toggleable={false}
  class="inline-activities-table"
>
  {#snippet body()}
    {#each activities as ctx (ctx.activity.id)}
      {@const configurable = Activities.isConfigurable(ctx.activity)}
      <TidyTableRow
        rowAttributes={{
          'data-item-id': ctx.activity.item.id,
          'data-activity-id': ctx.activity.id,
          'data-configurable': configurable,
          'data-info-card': 'activity',
          'data-info-card-entity-uuid': ctx.activity.uuid,
          'data-context-menu': CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES,
          'data-tidy-always-draggable': '',
        }}
        rowClass="activity"
        onmousedown={(event) =>
          FoundryAdapter.editOnMiddleClick(event, ctx.activity)}
      >
        <span class="activity-indent-icon">
          <i class="fa-solid fa-arrow-turn-right flip-y"></i>
        </span>
        <a
          class="tidy-table-row-use-button"
          onclick={(ev) => item.isOwner && rollActivity(ctx.activity, ev)}
        >
          {#if ctx.activity.img?.endsWith('.svg')}
            <img
              class="item-image"
              src={ctx.activity.img}
              alt={ctx.activity.name}
            />
          {:else}
            <img
              class="item-image"
              alt={ctx.activity.name}
              src={ctx.activity.img}
            />
          {/if}
          <span class="roll-prompt">
            <i class="fa fa-dice-d20"></i>
          </span>
        </a>
        <TidyTableCell primary={true} class="item-label text-cell">
          <span class="item-name">
            <span class="cell-text">
              <span class="cell-name">{ctx.activity.name}</span>
            </span>
          </span>
        </TidyTableCell>
        <TidyTableCell {...columns.uses} class="inline-uses">
          {#if configurable}
            <ActivityUsesColumn
              rowDocument={ctx.activity}
              rowContext={ctx}
              section={SheetSections.empty}
            />
          {/if}
        </TidyTableCell>
        <TidyTableCell {...columns.usage}>
          {getActivityUsageLabel(ctx.activity)}
        </TidyTableCell>
      </TidyTableRow>
    {/each}
  {/snippet}
</TidyTable>
