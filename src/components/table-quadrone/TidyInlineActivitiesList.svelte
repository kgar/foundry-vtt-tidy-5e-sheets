<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import TidyTable, { type TidyTableColumns } from './TidyTable.svelte';
  import TidyTableRow from './TidyTableRow.svelte';
  import TidyTableCell from './TidyTableCell.svelte';
  import type { Activity5e } from 'src/foundry/dnd5e.types';
  import Dnd5eIcon from '../icon/Dnd5eIcon.svelte';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { Activities } from 'src/features/activities/activities';
  import type { ActivityItemContext } from 'src/types/types';

  interface Props {
    item?: Item5e | null;
    activities: ActivityItemContext[] | undefined;
  }

  let { item = null, activities = [] }: Props = $props();

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  const gridTemplateColumns: TidyTableColumns = [
    {
      name: 'Name',
      width: '1fr',
    },
    {
      name: 'Uses',
      width: '2.5rem',
    },
    {
      name: 'Usage',
      width: '5rem',
    },
  ];

  function rollActivity(activity: Activity5e, event: MouseEvent) {
    activity.use({ event });
  }

  function getActivityUsageLabel(activity: Activity5e) {
    return (
      // @ts-expect-error
      CONFIG.DND5E.activityActivationTypes[activity.activation?.type]?.label ??
      activity.activation?.type ??
      ''
    );
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="inline-activities-container" data-item-id={item.id}>
  <TidyTable
    key="activities-{item.name}"
    toggleable={false}
    {gridTemplateColumns}
  >
    {#snippet body()}
      {#each activities as ctx (ctx.activity.id)}
        {@const configurable = Activities.isConfigurable(ctx.activity)}
        <TidyTableRow
          rowAttributes={{
            'data-activity-id': ctx.activity.id,
            'data-configurable': configurable,
            'data-info-card': 'activity',
            'data-info-card-entity-uuid': ctx.activity.uuid,
            'data-context-menu': CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES,
          }}
          rowClass="activity"
          onmousedown={(event) =>
            FoundryAdapter.editOnMiddleClick(event, ctx.activity)}
        >
          <a
            class="tidy-table-button item-use-button"
            onclick={(ev) => item.isOwner && rollActivity(ctx.activity, ev)}
          >
            {#if ctx.activity.img?.endsWith('.svg')}
              <Dnd5eIcon class="item-image" src={ctx.activity.img} />
            {:else}
              <img class="item-image" alt="" src={item.img} />
            {/if}
            <span class="roll-prompt">
              <i class="fa fa-dice-d20"></i>
            </span>
          </a>
          <TidyTableCell primary={true} class="item-label text-cell">
            {ctx.activity.name}
          </TidyTableCell>
          <TidyTableCell>
            {#if configurable}
              {#if ctx.isOnCooldown}
                <!-- <RechargeControl
                  document={ctx.activity}
                  field={'uses.spent'}
                  uses={ctx.activity.uses}
                /> -->
              {:else if ctx.hasRecharge}
                {@const remaining =
                  ctx.activity.uses.max - ctx.activity.uses.spent}
                {#if remaining > 1}
                  <span>{remaining}</span>
                {/if}
                <i class="fas fa-bolt" title={localize('DND5E.Charged')}></i>
              {:else if !!ctx.activity.uses?.max}
                <!-- <ActivityUses activity={ctx.activity} /> -->
              {:else}
                <span class="text-body-tertiary">&mdash;</span>
              {/if}
            {/if}
          </TidyTableCell>
          <TidyTableCell>
            {getActivityUsageLabel(ctx.activity)}
          </TidyTableCell>
        </TidyTableRow>
      {/each}
    {/snippet}
  </TidyTable>
</div>
