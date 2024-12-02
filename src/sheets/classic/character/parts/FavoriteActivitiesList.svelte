<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type ActivitySection,
    type CharacterSheetContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { Activity5e } from 'src/foundry/dnd5e.types';
  import { Activities } from 'src/features/activities/activities';
  import TidyTable from 'src/components/table/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';
  import TidyTableRow from 'src/components/table/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table/TidyTableCell.svelte';
  import ActivityUses from 'src/components/item-list/ActivityUses.svelte';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  interface Props {
    section: ActivitySection;
    visibleActivityUuidSubset: Set<string>;
  }

  let { section, visibleActivityUuidSubset }: Props = $props();

  const gridTemplateColumns = `
    /* Name */
    1fr
    /* Item Source */
    10rem
    /* Uses */
    2.5rem
    /* Usage */
    5rem
    /* Mod/Save */
    3.5rem
  `;

  const localize = FoundryAdapter.localize;

  function activityHasUses(activity: Activity5e) {
    return (activity.consumption?.targets ?? []).some(
      (t: any) => (t.value ?? 0) > 0 && t.type === 'activityUses',
    );
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_missing_attribute -->
<TidyTable key={section.key} class="favorite-activities" {gridTemplateColumns}>
  {#snippet header()}
    <TidyTableHeaderRow>
      <TidyTableHeaderCell primary={true}>
        {localize(section.label ?? 'DND5E.Effect')}
      </TidyTableHeaderCell>
      <TidyTableHeaderCell>
        {localize('DOCUMENT.Item')}
      </TidyTableHeaderCell>
      <TidyTableHeaderCell>
        <i class="fas fa-bolt"></i>
      </TidyTableHeaderCell>
      <TidyTableHeaderCell>
        {localize('DND5E.Usage')}
      </TidyTableHeaderCell>
      <TidyTableHeaderCell>
        <i class="fas fa-wand-sparkles"></i>
        <i class="fas fa-shield"></i>
      </TidyTableHeaderCell>
    </TidyTableHeaderRow>
  {/snippet}
  {#snippet body()}
    {#each section.activities as activity (activity.uuid)}
      <TidyTableRow
        rowClass="activity"
        rowAttributes={{
          'data-activity-id': activity.id,
          'data-configurable': Activities.isConfigurable(activity),
          'data-item-id': activity.item.id,
          'data-info-card': 'activity',
          'data-info-card-entity-uuid': activity.uuid,
        }}
        onmousedown={(ev) => FoundryAdapter.editOnMiddleClick(ev, activity)}
        hidden={visibleActivityUuidSubset !== null &&
          !visibleActivityUuidSubset.has(activity.uuid)}
      >
        <TidyTableCell primary={true}>
          <a
            class="item-table-image-button"
            onclick={(event) => $context.editable && activity.use({ event })}
          >
            <img src={activity.img} />
            <i class="fa fa-dice-d20 roll-indicator"></i>
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
            class="activity-item-link truncate align-self-stretch align-content-center flex-1"
            class:highlight-on-hover={$context.editable}
            onclick={(ev) =>
              $context.editable && activity.item.sheet.render(true)}
            title={activity.item.name}
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
          {@const label = activity.labels.toHit
            ? activity.labels.toHit
            : activity.save?.ability && activity.save?.dc?.value
              ? `${FoundryAdapter.getSaveAbilityAbbreviation(activity.save)} ${activity.save.dc.value}`.toLocaleUpperCase()
              : '—'}

          <span class="truncate" title={label}>
            {label}
          </span>
        </TidyTableCell>
      </TidyTableRow>
    {/each}
  {/snippet}
</TidyTable>
