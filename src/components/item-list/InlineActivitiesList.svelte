<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import TidyTable, { type TidyTableColumns } from '../table/TidyTable.svelte';
  import TidyTableRow from '../table/TidyTableRow.svelte';
  import TidyTableCell from '../table/TidyTableCell.svelte';
  import type { Activity5e } from 'src/foundry/dnd5e.types';
  import Dnd5eIcon from '../icon/Dnd5eIcon.svelte';
  import ActivityUses from './ActivityUses.svelte';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemImage from './ItemImage.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { Activities } from 'src/features/activities/activities';
  import type { ActivityItemContext } from 'src/types/types';
  import RechargeControl from './controls/RechargeControl.svelte';

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
          <TidyTableCell primary={true}>
            <span class="inline-activity-arrow">
              <i class="fa-solid fa-turn-up fa-fw"></i>
            </span>
            <a
              class="inline-activity-roll-button highlight-on-hover"
              onclick={(ev) => item.isOwner && rollActivity(ctx.activity, ev)}
              tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
            >
              {#if ctx.activity.img?.endsWith('.svg')}
                <Dnd5eIcon src={ctx.activity.img} />
              {:else}
                <ItemImage
                  classes="always-visible"
                  src={ctx.activity.img}
                  alt={ctx.activity.name}
                />
              {/if}
              {ctx.activity.name}
            </a>
          </TidyTableCell>
          <TidyTableCell>
            {#if configurable}
              {#if ctx.isOnCooldown}
                <RechargeControl
                  document={ctx.activity}
                  field={'uses.spent'}
                  uses={ctx.activity.uses}
                />
              {:else if ctx.hasRecharge}
                {@const remaining =
                  ctx.activity.uses.max - ctx.activity.uses.spent}
                {#if remaining > 1}
                  <span>{remaining}</span>
                {/if}
                <i class="fas fa-bolt" title={localize('DND5E.Charged')}></i>
              {:else if !!ctx.activity.uses?.max}
                <ActivityUses activity={ctx.activity} />
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
