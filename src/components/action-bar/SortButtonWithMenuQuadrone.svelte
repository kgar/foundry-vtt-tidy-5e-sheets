<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ButtonWithOptionPanel from '../buttons/ButtonWithOptionPanel.svelte';
  import type {
    SortGroup,
    SortGroupKeyQuadrone,
    SortMethodKeyQuadrone,
    SortMethodOption,
  } from 'src/types/sort.types';
  import { getContext, tick } from 'svelte';
  import { CONSTANTS } from 'src/constants';

  // TODO: Move and consolidate sort types to their own types file

  interface Props {
    method: SortMethodKeyQuadrone;
    group: SortGroupKeyQuadrone;
    methods: SortMethodOption[];
    groups: SortGroup[];
    doc: any;
  }

  let { method, group, methods, groups, doc }: Props = $props();

  let expanded = $state(false);

  let componentId = foundry.utils.randomID();

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let selected = $derived(methods.find((m) => m.key === method));

  async function onSortClicked(ev: MouseEvent, selected: SortMethodOption) {
    if (selected.onClick === 'menu') {
      expanded = !expanded;
      return;
    }

    await tick();

    selected.onClick(ev, doc, tabId, selected);
  }

  async function onGroupSelected(sortGroup: SortGroup) {
    expanded = false;
    await tick();
    await sortGroup.onSelect(doc, tabId, sortGroup);
  }

  const localize = FoundryAdapter.localize;
</script>

<ButtonWithOptionPanel
  buttonClasses="icon-button"
  anchor="right"
  onclick={(ev) => selected && onSortClicked(ev, selected)}
  buttonAttributes={{
    title: selected ? localize(selected.tooltip) : '',
    ['data-filter-method']: selected ? selected.name : 'sort-method-not-found',
  }}
  bind:expanded
>
  {#if selected}
    <i class={selected.icon}></i>
  {/if}

  {#snippet menu()}
    {#each groups as sortGroup}
      <label class="radio">
        <input
          id="{componentId}-{sortGroup.key.slugify()}"
          type="radio"
          name="{tabId}-sort-group"
          checked={group == sortGroup.key}
          onclick={() => onGroupSelected(sortGroup)}
          data-skip-submit
        />
        <span class="radio-label">
          {localize(sortGroup.label)}
        </span>
      </label>
    {/each}
  {/snippet}
</ButtonWithOptionPanel>
