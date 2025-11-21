<script lang="ts">
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Dnd5eActorCondition } from 'src/foundry/foundry-and-system';
  import ConditionToggleQuadrone from './ConditionToggleQuadrone.svelte';

  interface Props {
    conditions: Dnd5eActorCondition[];
  }

  let { conditions }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<TidyTable key="conditions">
  {#snippet header()}
    <TidyTableHeaderRow class="theme-dark">
      <TidyTableHeaderCell primary={true}>
        <h3>{localize('DND5E.Conditions')}</h3>
      </TidyTableHeaderCell>
    </TidyTableHeaderRow>
  {/snippet}
  {#snippet body()}
    <ul class="conditions-list">
      {#each conditions as condition (condition.id)}
        <li
          class={[
            'condition',
            {
              active: !condition.disabled,
              'content-link': !!condition.reference,
            },
          ]}
          data-uuid={condition.reference}
          data-condition-id={condition.id}
          data-tooltip={condition.name}
        >
          <ConditionToggleQuadrone {condition} />
        </li>
      {/each}
    </ul>
  {/snippet}
</TidyTable>
