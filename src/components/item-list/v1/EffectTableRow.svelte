<script lang="ts">
  import { type OnItemToggledFn } from 'src/types/types';
  import { getContext, type Snippet } from 'svelte';
  import type { ActiveEffect5e, ActiveEffectContext } from 'src/types/types';
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

  let showSummary = $state(false);

  async function toggleSummary() {
    showSummary = !showSummary;
    onEffectToggled?.(effectDocument.id, showSummary, location);
  }

  function handleDragStart(event: DragEvent) {
    const dragData = effectDocument.toDragData?.();
    if (dragData) {
      event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
    }
  }
</script>

<div
  class="effect-table-row-container"
  class:hidden
  aria-hidden={hidden}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS}
  data-effect-id={activeEffect?.id}
  data-parent-id={activeEffect?.parentId ?? activeEffect?.parent?.id}
  onmousedown={(event) =>
    FoundryAdapter.editOnMiddleClick(event, effectDocument)}
  ondragstart={handleDragStart}
  draggable={true}
  data-tidy-table-row
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.EFFECT_TABLE_ROW}
  data-info-card="effect"
  data-info-card-entity-uuid={activeEffect.uuid}
  {...attributes}
>
  <div class="item-table-row {cssClass ?? ''}">
    {@render children?.({ toggleSummary })}
  </div>
  <ExpandableContainer expanded={showSummary}>
    <EffectSummary activeEffect={activeEffect.effect} />
  </ExpandableContainer>
</div>

<style lang="scss">
  .effect-table-row-container {
    position: relative;
    border-radius: 0.3125rem;
    margin: 0 0 0.125rem 0.5rem;
    background: var(--t5e-faintest-color);
  }
</style>
