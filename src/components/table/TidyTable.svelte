<script module>
  export type TidyTableColumns = {
    name: string;
    width: string;
  }[];
</script>

<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { declareLocation } from 'src/types/location-awareness.types';
  import { getContext, setContext, type Snippet } from 'svelte';
  import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';

  interface Props {
    key: string;
    toggleable?: boolean;
    gridTemplateColumns?: TidyTableColumns;
    header?: Snippet;
    body?: Snippet;
    [key: string]: any;
  }

  let {
    key,
    toggleable = true,
    gridTemplateColumns = [],
    header,
    body,
    ...rest
  }: Props = $props();

  let templateColumnsValue = $derived(
    gridTemplateColumns.map((c) => `/* ${c.name} */ ${c.width}`).join(' '),
  );

  let { class: cssClass, ...attributes } = rest;

  declareLocation('item-table', key);

  const sectionExpansionTracker = getContext<ExpansionTracker>(
    'sectionExpansionTracker',
  );

  const { tabId, location } = sectionExpansionTracker.getContextKeys();
  sectionExpansionTracker.register(key, tabId, location);

  let expanded = $derived(
    sectionExpansionTracker.isExpanded(key, tabId, location),
  );

  setContext('sectionToggle', () => {
    return {
      expanded,
      toggle: () => sectionExpansionTracker.toggle(key, tabId, location),
    };
  });

  $effect(() => {
    return () => {
      sectionExpansionTracker.unregister(key, tabId, location);
    };
  });
</script>

<section
  class="tidy-table {cssClass ?? ''}"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_TABLE}
  data-tidy-section-key={key}
  {...attributes}
  style="--grid-template-columns: {templateColumnsValue}"
>
  {@render header?.()}
  <ExpandableContainer {expanded}>
    <div class="item-table-body">
      {@render body?.()}
    </div>
  </ExpandableContainer>
</section>
