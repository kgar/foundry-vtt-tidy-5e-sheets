<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import TidyTable from '../table/TidyTable.svelte';
  import TidyTableRow from '../table/TidyTableRow.svelte';
  import TidyTableCell from '../table/TidyTableCell.svelte';
  import type { Activity5e } from 'src/foundry/dnd5e.types';
  import Dnd5eIcon from '../icon/Dnd5eIcon.svelte';
  import ActivityUses from './ActivityUses.svelte';
  import ActivityAddUses from './ActivityAddUses.svelte';

  export let item: Item5e | null = null;

  const gridTemplateColumns = `
    /* Name */
    1fr
    /* Uses */
    5rem
    /* Usage */
    5rem
  `;

  function rollActivity(activity: Activity5e, event: MouseEvent) {
    activity.use({ event });
  }

  function getActivityUsageLabel(activity: Activity5e) {
    return (
      // @ts-expect-error
      CONFIG.DND5E.activityActivationTypes[activity.activation.type]?.label ??
      activity.activation.type
    );
  }
</script>

{#if item?.system.activities?.contents.length}
  <div class="inline-activities-container">
    <TidyTable
      key="activities-{item.name}"
      toggleable={false}
      --grid-template-columns={gridTemplateColumns}
    >
      <svelte:fragment slot="body">
        {#each item.system.activities.contents as activity (activity.id)}
          <TidyTableRow>
            <TidyTableCell primary={true}>
              <button
                type="button"
                class="inline-activity-roll-button highlight-on-hover"
                on:click={(ev) => rollActivity(activity, ev)}
              >
                {#if activity.img?.endsWith('.svg')}
                  <Dnd5eIcon src={activity.img} />
                {:else}
                  <img
                    src={activity.img}
                    class="activity-icon"
                    alt={activity.name}
                  />
                {/if}
                {activity.name}
              </button>
            </TidyTableCell>
            <TidyTableCell>
              {#if !!activity.uses.max}
                <ActivityUses {activity} />
              {:else}
                <ActivityAddUses {activity} />
              {/if}
            </TidyTableCell>
            <TidyTableCell>
              {getActivityUsageLabel(activity)}
            </TidyTableCell>
          </TidyTableRow>
        {/each}
      </svelte:fragment>
    </TidyTable>
  </div>
{/if}

<style lang="scss">
  .inline-activities-container {
    --icon-size: 20px;
    --icon-fill: var(--t5e-primary-font-color);
  }

  .inline-activity-roll-button {
    background: none;
    text-align: left;
    font-size: 0.75rem;
    border: none;
    transition: color 0.3s;
    display: flex;
    gap: 0.25rem;
    align-items: center;

    &:hover {
      background: none;
    }
  }
</style>
