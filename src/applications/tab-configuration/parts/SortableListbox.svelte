<script lang="ts" module>
  /**
   * Item using `key` as the identity. Sections already have it, tabs
   * map to it using `id`.
   */
  export type SortableListboxItem = {
    key: string;
    label: string;
    iconClass?: string;
    show: boolean;
    visibilityLevel?: number | null;
  };
</script>

<script lang="ts">
  import { untrack } from 'svelte';
  import FieldToggle from 'src/components/toggles/FieldToggle.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { VisibilityLevels } from 'src/features/visibility-levels/VisibilityLevels';
  import { arrayMove } from 'src/utils/array';
  import type { TabConfigContextEntry } from '../tab-configuration.types';

  type HeaderLabels = {
    primary?: string;
    userVisibility?: string;
    show?: string;
  };

  interface Props {
    /** Tab-config mode: bind a {@link TabConfigContextEntry}; rows map to/from its `tabs`/`visibilityLevels`. */
    tabConfigContext?: TabConfigContextEntry;
    /** Items mode: bind a list of `key`-identified items directly (e.g. sections). */
    items?: SortableListboxItem[];
    /** Show the per-row user-visibility column. Hidden for section configuration. */
    showUserVisibility?: boolean;
    /** Visibility level `<select>` options; defaults to the entry's document name options. */
    visibilityLevelOptions?: { key: any; value: any; label: string }[];
    headerLabels?: HeaderLabels;
  }

  let {
    tabConfigContext = $bindable(),
    items = $bindable(),
    showUserVisibility = true,
    visibilityLevelOptions: visibilityLevelOptionsProp,
    headerLabels,
  }: Props = $props();

  const localize = FoundryAdapter.localize;
  const userIsGm = FoundryAdapter.userIsGm();

  // Vertical gap between rows, in px (keep in sync with the listbox `gap`).
  // This moves the offset for the drag indicator.
  const ROW_GAP = 8;

  let visibilityLevelOptions = $derived(
    visibilityLevelOptionsProp ??
      (tabConfigContext ? VisibilityLevels.getOptions(tabConfigContext.documentName) : []),
  );

  // Collapse source into editable rows. In tabs mode the list is
  // already ordered (visible first, then hidden) and visibility lives in a
  // separate array; in items mode the items are the rows.
  function buildRows(): SortableListboxItem[] {
    if (tabConfigContext) {
      const viewerLevelById = new Map(
        tabConfigContext.visibilityLevels.map((l) => [l.id, l.visibilityLevel]),
      );

      return tabConfigContext.tabs.map((tab) => ({
        key: tab.id,
        label: tabConfigContext!.allTabs[tab.id]?.title ?? tab.title,
        iconClass: tabConfigContext!.allTabs[tab.id]?.iconClass ?? tab.iconClass,
        show: tab.show,
        visibilityLevel: viewerLevelById.get(tab.id) ?? null,
      }));
    }

    // Items mode: the items are already `key`-identified rows.
    return (items ?? []).map((item) => ({ ...item }));
  }

  let rows = $state<SortableListboxItem[]>(buildRows());
  let selectedIndex = $state<number | null>(null);

  // Rebuild rows when a new source is applied from undo/reset
  let trackedTabConfigContext = tabConfigContext;
  let trackedItems = items;
  $effect(() => {
    const sourceChanged = tabConfigContext
      ? tabConfigContext !== trackedTabConfigContext
      : items !== trackedItems;
    if (sourceChanged) {
      trackedTabConfigContext = tabConfigContext;
      trackedItems = items;
      rows = buildRows();
      selectedIndex = null;
    }
  });

  // Write any change (reorder, show/hide, viewer level) back to the bound
  // source so the host reads it when saving.
  $effect(() => {
    if (tabConfigContext) {
      tabConfigContext.tabs = rows.map((row) => ({
        id: row.key,
        title: row.label,
        iconClass: row.iconClass,
        show: row.show,
      }));
      tabConfigContext.visibilityLevels = rows.map((row) => ({
        id: row.key,
        title: row.label,
        show: row.show,
        visibilityLevel: row.visibilityLevel ?? null,
      }));
    } else if (items) {
      const next = rows.map((row) => ({ ...row }));
      // Mutate the bound array in place (untracked) so its reference stays
      // stable — reassigning a $bindable array loops endlessly
      untrack(() => {
        items!.splice(0, items!.length, ...next);
      });
    }
  });

  function moveUp() {
    if (selectedIndex === null || selectedIndex === 0) {
      return;
    }
    arrayMove(rows, selectedIndex, selectedIndex - 1);
    rows = rows;
    selectedIndex -= 1;
  }

  function moveDown() {
    if (selectedIndex === null || selectedIndex >= rows.length - 1) {
      return;
    }
    arrayMove(rows, selectedIndex, selectedIndex + 1);
    rows = rows;
    selectedIndex += 1;
  }

  function onListKeydown(ev: KeyboardEvent) {
    ev.stopPropagation();

    if (rows.length === 0) {
      return;
    }

    const current = selectedIndex ?? -1;

    if (ev.key === 'ArrowUp' && ev.altKey) {
      moveUp();
      ev.preventDefault();
    } else if (ev.key === 'ArrowDown' && ev.altKey) {
      moveDown();
      ev.preventDefault();
    } else if (ev.key === 'ArrowUp') {
      selectedIndex = Math.max(0, current - 1);
      ev.preventDefault();
    } else if (ev.key === 'ArrowDown') {
      selectedIndex = Math.min(rows.length - 1, current + 1);
      ev.preventDefault();
    }
  }

  // --- Drag to reorder, with a drop indicator that lies in the gap between rows ---

  let rowElements: HTMLLIElement[] = $state([]);
  let draggedIndex = $state<number | null>(null);
  let dropIndicatorIndex = $state<number | null>(null);

  // The indicator's y-offset, centered in the gap before `dropIndicatorIndex`.
  let dropLineTop = $derived.by(() => {
    if (dropIndicatorIndex === null) {
      return null;
    }

    if (dropIndicatorIndex < rows.length) {
      const el = rowElements[dropIndicatorIndex];
      return el ? el.offsetTop - ROW_GAP + 2 : null;
    }

    const el = rowElements[rows.length - 1];
    return el ? el.offsetTop + el.offsetHeight + ROW_GAP / 2 : null;
  });

  function onDragStart(ev: DragEvent, index: number) {
    draggedIndex = index;
    selectedIndex = index;
    ev.dataTransfer?.setData('text/plain', index.toString());
    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = 'move';
    }
  }

  // Target the entire list. Drop zone is midway between each item.
  function onListDragOver(ev: DragEvent) {
    ev.preventDefault();

    const y = ev.clientY;
    let gap = rows.length;
    for (let i = 0; i < rows.length; i++) {
      const rect = rowElements[i]?.getBoundingClientRect();
      if (rect && y < rect.top + rect.height / 2) {
        gap = i;
        break;
      }
    }

    // Hide the indicator when the drop would be a no-op (dropping next to self).
    if (
      draggedIndex !== null &&
      (gap === draggedIndex || gap === draggedIndex + 1)
    ) {
      dropIndicatorIndex = null;
      return;
    }

    dropIndicatorIndex = gap;
  }

  function onDragEnd() {
    draggedIndex = null;
    dropIndicatorIndex = null;
  }

  function onDrop(ev: DragEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    const draggedIdx = parseInt(ev.dataTransfer?.getData('text/plain') ?? '');
    const gap = dropIndicatorIndex;
    draggedIndex = null;
    dropIndicatorIndex = null;

    if (isNaN(draggedIdx) || gap === null) {
      return;
    }

    // Removing the dragged item shifts later positions down by one.
    const target = gap > draggedIdx ? gap - 1 : gap;
    if (target === draggedIdx) {
      return;
    }

    arrayMove(rows, draggedIdx, target);
    rows = rows;
    selectedIndex = target;
  }
</script>

<fieldset class="tab-selection-list" class:no-user-visibility={!showUserVisibility}>
  <div class="tab-selection-header">
    <span class="tab-selection-header-label tabs-label font-label-medium">
      {headerLabels?.primary ?? 'Tab'}
    </span>
    {#if showUserVisibility}
      <span class="tab-selection-header-label viewers-label font-label-medium">
        {headerLabels?.userVisibility ?? 'User Visibility'}
      </span>
    {/if}
    <span class="tab-selection-header-label visibility-label font-label-medium">
      {headerLabels?.show ?? 'Show Tab'}
    </span>
  </div>
  <div class="tab-selection-body">
    <div class="controls">
      <button
        type="button"
        class="button button-primary button-icon-only"
        title={localize('TIDY5E.Listbox.MoveUp')}
        aria-keyshortcuts="Alt+ArrowUp"
        disabled={selectedIndex === null || selectedIndex === 0}
        onclick={moveUp}
      >
        <i class="fas fa-arrow-up"></i>
      </button>
      <button
        type="button"
        class="button button-primary button-icon-only"
        title={localize('TIDY5E.Listbox.MoveDown')}
        aria-keyshortcuts="Alt+ArrowDown"
        disabled={selectedIndex === null || selectedIndex >= rows.length - 1}
        onclick={moveDown}
      >
        <i class="fas fa-arrow-down"></i>
      </button>
    </div>
    <ul
      class="tab-selection-listbox"
      role="listbox"
      tabindex="0"
      onkeydown={onListKeydown}
      ondragover={onListDragOver}
      ondrop={onDrop}
    >
      {#each rows as item, i (item.key)}
        {@const canConfigureViewers =
          userIsGm || item.visibilityLevel !== CONSTANTS.VISIBILITY_LEVEL_GM}
        <li
          bind:this={rowElements[i]}
          class="listbox-item"
          class:marked-as-hidden={!item.show}
          class:focused={selectedIndex === i}
          class:dragging={draggedIndex === i}
          role="option"
          aria-selected={selectedIndex === i}
          draggable="true"
          onclick={() => (selectedIndex = i)}
          onkeydown={onListKeydown}
          ondragstart={(ev) => onDragStart(ev, i)}
          ondragend={onDragEnd}
        >
          <i class="drag-grip fa-solid fa-grip-lines fa-fw" aria-hidden="true"
          ></i>
          {#if item.iconClass}
            <i class="{item.iconClass} fa-fw tab-row-icon"></i>
          {/if}
          <span
            data-section-key={item.key}
            data-testid="section-config-item-label"
            class="section-config-item-label font-label-medium">{item.label}</span
          >
          {#if showUserVisibility && item.show && canConfigureViewers}
            <select
              class="tab-viewers-button"
              title={localize('TIDY5E.TabConfiguration.options.viewers')}
              bind:value={item.visibilityLevel}
            >
              {#each visibilityLevelOptions as option (option.key)}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          {/if}
          <div class="tab-visibility-switch">
            <FieldToggle
              checked={item.show}
              onchange={(ev) => {
                item.show = (ev.currentTarget as HTMLInputElement).checked;
                selectedIndex = i;
              }}
              disabled={showUserVisibility && !canConfigureViewers}
            />
          </div>
        </li>
      {/each}
      {#if dropLineTop !== null}
        <li
          class="drop-line"
          style="top: {dropLineTop}px"
          role="presentation"
          aria-hidden="true"
        ></li>
      {/if}
    </ul>
  </div>
</fieldset>
