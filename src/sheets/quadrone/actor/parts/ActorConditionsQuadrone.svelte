<script lang="ts">
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Dnd5eActorCondition } from 'src/foundry/foundry-and-system';
  import type { ActorSheetQuadroneContext } from 'src/types/types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import ConditionToggleQuadrone from './ConditionToggleQuadrone.svelte';
  import ExhaustionToggle from './ExhaustionToggle.svelte';

  interface Props {
    conditions: Dnd5eActorCondition[];
    isBasicTheme: boolean;
  }

  let { conditions, isBasicTheme }: Props = $props();

  const context = $derived(getSheetContext<ActorSheetQuadroneContext>());
  const localize = FoundryAdapter.localize;

  // Vehicles and similar actors have exhaustion in the condition catalog
  // but no numeric exhaustion attribute to increment.
  let hasExhaustionAttribute = $derived(
    Number.isFinite(context.system.attributes?.exhaustion),
  );
</script>

<TidyTable key="conditions">
  {#snippet header()}
    <TidyTableHeaderRow class={!isBasicTheme ? 'theme-dark' : ''}>
      <TidyTableHeaderCell primary={true} class="header-label-cell">
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
              exhaustion: condition.id === 'exhaustion',
              active: !condition.disabled,
              'content-link': !!condition.reference,
            },
          ]}
          data-uuid={condition.reference}
          data-condition-id={condition.id}
          data-tooltip={condition.name}
        >
          {#if condition.id === 'exhaustion' && hasExhaustionAttribute}
            <ExhaustionToggle {condition} />
          {:else}
            <ConditionToggleQuadrone {condition} />
          {/if}
        </li>
      {/each}
    </ul>
  {/snippet}
</TidyTable>
