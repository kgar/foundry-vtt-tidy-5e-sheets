<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ButtonWithOptionPanel from '../buttons/ButtonWithOptionPanel.svelte';
  import type { SortGroup, SortMethodOption } from 'src/types/sort.types';
  import { tick } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import { ItemSortRuntime } from 'src/runtime/item/ItemSortRuntime.svelte';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';

  interface Props {
    doc: any;
    tabId: string;
  }

  let { doc, tabId }: Props = $props();

  let method = $derived(
    SheetPreferencesService.getByType(doc.type).tabs?.[tabId]?.sort ?? 'm',
  );

  let group = $derived(ItemSortRuntime.getGroupFromMethod(method)?.key);

  let groups = $derived(
    ItemSortRuntime.getDocumentSortGroupQuadrone(doc, tabId),
  );

  let methods = $derived(
    ItemSortRuntime.getDocumentSortMethodsQuadrone(doc, tabId) ?? [],
  );

  let expanded = $state(false);

  let componentId = foundry.utils.randomID();

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
  buttonClasses="button-secondary button-icon-only button-toggle"
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
    <h4>{localize('TIDY5E.ExpandCollapseMenu.OptionTitle')}</h4>
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
          {#if sortGroup.subtitle}
            <span class="radio-label-subtitle"
              >{localize(sortGroup.subtitle)}</span
            >
          {/if}
        </span>
      </label>
    {/each}
  {/snippet}
</ButtonWithOptionPanel>
