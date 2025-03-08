<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ButtonWithOptionPanel from '../buttons/ButtonWithOptionPanel.svelte';
  import type {
    SortGroupKeyQuadrone,
    SortMethodKeyQuadrone,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';

  // TODO: Move and consolidate sort types to their own types file
  type SortGroup = {
    key: SortGroupKeyQuadrone;
    label: string;
    onSelect: (doc: any, group: SortGroup) => Promise<any>;
  };

  type SortMethodOption = {
    key: SortMethodKeyQuadrone;
    name: string;
    onClick:
      | 'menu'
      | ((ev: MouseEvent, doc: any, mode: SortMethodOption) => Promise<any>);
    icon: string;
    tooltip: string;
  };

  interface Props {
    method: SortMethodKeyQuadrone;
    group: SortGroupKeyQuadrone;
    options: SortMethodOption[];
    groups: SortGroup[];
    doc: any;
  }

  let { method, group, options, groups, doc }: Props = $props();

  let expanded = $state(false);

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let selected = $derived(options.find((o) => o.key === method));

  function onSortClicked(ev: MouseEvent, selected: SortMethodOption) {
    if (selected.onClick === 'menu') {
      expanded = !expanded;
      return;
    }

    selected.onClick(ev, doc, selected);
  }

  const localize = FoundryAdapter.localize;
</script>

{#if selected}
  <ButtonWithOptionPanel
    buttonClasses="icon-button"
    anchor="right"
    onclick={(ev) => onSortClicked(ev, selected)}
    buttonAttributes={{
      title: selected.tooltip,
      ['data-filter-method']: selected.name,
    }}
  >
    <i class={selected.icon}></i>

    {#snippet menu()}
      {#each groups as sortGroup}
        <label class="radio">
          <input
            type="radio"
            name="{tabId}-sort-group"
            checked={group == sortGroup.key}
            onclick={() => sortGroup.onSelect(doc, sortGroup)}
            data-skip-submit
          />
          <span class="radio-label">
            {localize(sortGroup.label)}
          </span>
        </label>
      {/each}
    {/snippet}
  </ButtonWithOptionPanel>
{/if}
