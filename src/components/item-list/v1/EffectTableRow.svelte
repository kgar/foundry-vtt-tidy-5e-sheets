<script lang="ts">
  import { type OnItemToggledFn } from 'src/types/types';
  import { getContext, type Snippet } from 'svelte';
  import type {
    ActiveEffect5e,
    ActiveEffectContext,
    EffectSummaryData,
  } from 'src/types/types';
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import EffectSummary from '../EffectSummary.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    activeEffect?: ActiveEffect5e | ActiveEffectContext | null;
    cssClass?: string;
    hidden?: boolean;
    attributes?: Record<string, any>;
    children?: Snippet<[any]>;
  }

  let {
    activeEffect = null,
    cssClass = '',
    hidden = false,
    attributes,
    children,
  }: Props = $props();

  let effectDocument = $derived(activeEffect?.effect ?? activeEffect);

  const onEffectToggled = getContext<OnItemToggledFn>(
    CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TOGGLED,
  );

  const location = getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION);

  let expanded = $state(false);

  async function toggleSummary() {
    expanded = !expanded;
    onEffectToggled?.(effectDocument.id, expanded, location);
  }

  function handleDragStart(event: DragEvent) {
    if (event.target !== event.currentTarget) {
      // Allow for draggables within this containing element to be handled elsewhere.
      return;
    }

    const dragData = effectDocument.toDragData?.();
    if (dragData) {
      event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
    }
  }

  let emptySummaryData: EffectSummaryData = {
    description: {
      value: '',
    },
  };

  let summaryData = $state<EffectSummaryData | undefined>();

  $effect(() => {
    (async () => {
      if (effectDocument && expanded) {
        summaryData = {
          description: {
            value: await FoundryAdapter.enrichHtml(
              effectDocument.description ?? '',
            ),
          },
        };
      } else if (effectDocument && !expanded && summaryData !== undefined) {
        // Reset chat data for non-expanded, hydrated chatData
        // so it rehydrates on next open
        summaryData = undefined;
      }
    })();
  });
</script>

<div
  class="effect-table-row-container"
  class:hidden
  aria-hidden={hidden}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS}
  data-effect-id={effectDocument?.id}
  data-parent-id={activeEffect?.parentId ?? activeEffect?.parent?.id}
  data-tidy-always-draggable
  onmousedown={(event) =>
    FoundryAdapter.editOnMiddleClick(event, effectDocument)}
  ondragstart={handleDragStart}
  data-tidy-table-row
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.EFFECT_TABLE_ROW}
  data-info-card="effect"
  data-info-card-entity-uuid={effectDocument.uuid}
  {...attributes}
>
  <div class="effect-table-row {cssClass ?? ''}">
    {@render children?.({ toggleSummary })}
  </div>
  <ExpandableContainer {expanded}>
    <EffectSummary
      activeEffect={effectDocument}
      summaryData={summaryData ?? emptySummaryData}
    />
  </ExpandableContainer>
</div>

<style lang="less">
  .effect-table-row-container {
    position: relative;
    border-radius: 0.3125rem;
    margin: 0 0 0.125rem 0.5rem;
    background: var(--t5e-faintest-color);

    .effect-table-row {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      border-radius: 0.3125rem;
    }
  }
</style>
