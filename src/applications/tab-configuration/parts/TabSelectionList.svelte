<script lang="ts">
  import FieldToggle from 'src/components/toggles/FieldToggle.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { VisibilityLevels } from 'src/features/visibility-levels/VisibilityLevels';
  import { arrayMove } from 'src/utils/array';
  import type { TabConfigContextEntry } from '../tab-configuration.types';

  interface Props {
    entry: TabConfigContextEntry;
  }

  let { entry = $bindable() }: Props = $props();

  const localize = FoundryAdapter.localize;
  const userIsGm = FoundryAdapter.userIsGm();

  // Vertical gap between rows, in px (keep in sync with the listbox `gap`).
  const ROW_GAP = 8;

  let visibilityLevelOptions = VisibilityLevels.getOptions(entry.documentName);

  type TabRow = {
    id: string;
    title: string;
    iconClass?: string;
    show: boolean;
    visibilityLevel: number | null;
  };

  // Collapse the entry's separate selected/unselected/visibility data into a
  // single ordered list: visible tabs (in order) first, then hidden tabs.
  function buildRows(): TabRow[] {
    const levelById = new Map(
      entry.visibilityLevels.map((l) => [l.id, l.visibilityLevel]),
    );

    const toRow = (tab: { id: string }, show: boolean): TabRow => ({
      id: tab.id,
      title: entry.allTabs[tab.id]?.title ?? tab.id,
      iconClass: entry.allTabs[tab.id]?.iconClass,
      show,
      visibilityLevel: levelById.get(tab.id) ?? null,
    });

    return [
      ...entry.selected.map((t) => toRow(t, true)),
      ...entry.unselected.map((t) => toRow(t, false)),
    ];
  }

  let rows = $state<TabRow[]>(buildRows());
  let selectedIndex = $state<number | null>(null);

  // Rebuild the editable rows when the host swaps in a new entry object (Undo /
  // Use Global Defaults). Tracked by identity only — the write-back effect below
  // mutates entry's properties, never its reference, so it won't retrigger this.
  let trackedEntry = entry;
  $effect(() => {
    if (entry !== trackedEntry) {
      trackedEntry = entry;
      rows = buildRows();
      selectedIndex = null;
    }
  });

  // Write any change (reorder, show/hide, viewer level) back to the entry so
  // the host application reads it when saving.
  $effect(() => {
    const selected: TabConfigContextEntry['selected'] = [];
    const unselected: TabConfigContextEntry['unselected'] = [];

    for (const row of rows) {
      const info = {
        id: row.id,
        title: row.title,
        iconClass: row.iconClass,
      };
      (row.show ? selected : unselected).push(info);
    }

    entry.selected = selected;
    entry.unselected = unselected;
    entry.visibilityLevels = rows.map((row) => ({
      id: row.id,
      title: row.title,
      visibilityLevel: row.visibilityLevel,
    }));
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

  let rowEls: HTMLLIElement[] = [];
  let draggedIndex = $state<number | null>(null);
  let dropIndicatorIndex = $state<number | null>(null);

  // The indicator's y-offset, centered in the gap before `dropIndicatorIndex`.
  let dropLineTop = $derived.by(() => {
    if (dropIndicatorIndex === null) {
      return null;
    }

    if (dropIndicatorIndex < rows.length) {
      const el = rowEls[dropIndicatorIndex];
      return el ? el.offsetTop - ROW_GAP + 2 : null;
    }

    const el = rowEls[rows.length - 1];
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
      const rect = rowEls[i]?.getBoundingClientRect();
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

<fieldset class="tab-selection-list">
  <div class="tab-selection-header">
    <span class="tab-selection-header-label tabs-label font-label-medium">
      Tab
    </span>
    <span class="tab-selection-header-label viewers-label font-label-medium">
      User Visibility
    </span>
    <span class="tab-selection-header-label visibility-label font-label-medium">
      Show Tab
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
      {#each rows as item, i (item.id)}
        {@const canConfigureViewers =
          userIsGm || item.visibilityLevel !== CONSTANTS.VISIBILITY_LEVEL_GM}
        <li
          bind:this={rowEls[i]}
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
          <span class="section-config-item-label font-label-medium"
            >{item.title}</span
          >
          {#if item.show && canConfigureViewers}
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
            disabled={!canConfigureViewers}
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
