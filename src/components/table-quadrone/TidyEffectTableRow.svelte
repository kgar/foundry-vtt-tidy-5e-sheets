<script module lang="ts">
  import type { EffectSummaryData as EffectSummaryDataType } from 'src/types/types';

  const emptySummaryData: EffectSummaryDataType = {
    description: {
      value: '',
    },
  };
</script>

<script lang="ts">
  import { type OnItemToggledFn } from 'src/types/types';
  import { getContext, type Snippet } from 'svelte';
  import type { EffectSummaryData, ActiveEffectContext } from 'src/types/types';
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import TidyEffectSummary from './TidyEffectSummary.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTableRow from '../table-quadrone/TidyTableRow.svelte';
  import { isUserInteractable } from 'src/utils/element';

  interface Props {
    effectContext: ActiveEffectContext;
    rowClass?: string;
    hidden?: boolean;
    attributes?: Record<string, any>;
    children?: Snippet<[{ toggleSummary: () => void; expanded: boolean }]>;
    expanded?: boolean;
  }

  let {
    effectContext,
    rowClass = '',
    hidden = false,
    attributes,
    children,
    expanded = $bindable(false),
  }: Props = $props();

  const onEffectToggled = getContext<OnItemToggledFn>(
    CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TOGGLED,
  );

  const location = getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION);

  async function toggleSummary() {
    expanded = !expanded;
    onEffectToggled?.(effectContext.effect.id, expanded, location);
  }

  let summaryData = $state<EffectSummaryData | undefined>();

  $effect(() => {
    (async () => {
      if (effectContext.effect && expanded) {
        summaryData = {
          description: {
            value: await FoundryAdapter.enrichHtml(
              effectContext.effect.description ?? '',
            ),
          },
        };
      }
    })();
  });
</script>

<TidyTableRow
  rowClass="tidy-table-row-v2 {rowClass} {expanded ? 'expanded' : ''}"
  rowAttributes={{
    ['data-effect-id']: effectContext.id,
    ['data-context-menu']: CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS,
    ['data-tidy-always-draggable']: '',
    ['data-tidy-table-row']: '',
    ['data-tidy-sheet-part']: CONSTANTS.SHEET_PARTS.EFFECT_TABLE_ROW,
    ['data-parent-id']: effectContext?.parentId ?? effectContext?.parent?.id,
  }}
  {hidden}
  {...attributes}
>
  {@render children?.({ toggleSummary, expanded: expanded })}

  {#snippet afterRow()}
    <ExpandableContainer {expanded} deferRendering>
      <TidyEffectSummary
        activeEffect={effectContext.effect}
        summaryData={summaryData ?? emptySummaryData}
      />
    </ExpandableContainer>
  {/snippet}
</TidyTableRow>
