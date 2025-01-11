<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import TidyTable from '../table/TidyTable.svelte';
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

  interface Props {
    item?: Item5e | null;
    activities: ActivityItemContext[] | undefined;
  }

  let { item = null, activities = [] }: Props = $props();

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  const gridTemplateColumns = `
    /* Name */
    1fr
    /* Uses */
    2.5rem
    /* Usage */
    5rem
  `;

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
</script>

<div class="inline-activities-container" data-item-id={item.id}>
  <TidyTable
    key="activities-{item.name}"
    toggleable={false}
    {gridTemplateColumns}
  >
    {#snippet body()}
      {#each activities as { activity } (activity.id)}
        {@const configurable = Activities.isConfigurable(activity)}
        <TidyTableRow
          rowAttributes={{
            'data-activity-id': activity.id,
            'data-configurable': configurable,
            'data-info-card': 'activity',
            'data-info-card-entity-uuid': activity.uuid,
          }}
          rowClass="activity"
          onmousedown={(event) =>
            FoundryAdapter.editOnMiddleClick(event, activity)}
        >
          <TidyTableCell primary={true}>
            <span class="inline-activity-arrow">
              <i class="fa-solid fa-turn-up fa-fw"></i>
            </span>
            <a
              class="inline-activity-roll-button highlight-on-hover"
              onclick={(ev) => item.isOwner && rollActivity(activity, ev)}
              tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
            >
              {#if activity.img?.endsWith('.svg')}
                <Dnd5eIcon src={activity.img} />
              {:else}
                <ItemImage
                  classes="always-visible"
                  src={activity.img}
                  alt={activity.name}
                />
              {/if}
              {activity.name}
            </a>
          </TidyTableCell>
          <TidyTableCell>
            {#if configurable}
              {#if !!activity.uses?.max}
                <ActivityUses {activity} />
              {:else}
                <span class="text-body-tertiary">&mdash;</span>
              {/if}
            {/if}
          </TidyTableCell>
          <TidyTableCell>
            {getActivityUsageLabel(activity)}
          </TidyTableCell>
        </TidyTableRow>
      {/each}
    {/snippet}
  </TidyTable>
</div>
