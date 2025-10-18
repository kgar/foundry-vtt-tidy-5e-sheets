<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ButtonWithOptionPanel from '../buttons/ButtonWithOptionPanel.svelte';
  import type {
    SortMethodOption,
    SortMethodScheme,
  } from 'src/types/sort.types';
  import { tick } from 'svelte';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';

  interface Props {
    doc: any;
    tabId: string;
    methods: SortMethodScheme[];
  }

  let { doc, tabId, methods }: Props = $props();

  let currentMethodKey = $derived(
    UserSheetPreferencesService.getByType(doc.type).tabs?.[tabId]?.sort ?? 'm',
  );

  let expanded = $state(false);

  let selected = $derived(methods.find((m) => m.key === currentMethodKey));

  async function onSortClicked(ev: MouseEvent, selected: SortMethodOption) {
    await tick();

    selected.onClick(doc, tabId);
  }

  const localize = FoundryAdapter.localize;

  function cycleSort() {
    let selectedIndex = methods.findIndex((m) => m.key === selected?.key);
    let toSelect = methods[(selectedIndex + 1) % methods.length];
    toSelect.onClick(doc, tabId);
    expanded = false;
  }
</script>

<ButtonWithOptionPanel
  buttonClasses="button-secondary button-icon-only button-toggle"
  side="right"
  onclick={(ev) => selected && cycleSort()}
  buttonAttributes={{
    ['data-tooltip']: selected ? localize(selected.tooltip) : '',
    ['data-filter-method']: selected ? selected.key : 'sort-method-not-found',
  }}
  bind:expanded
>
  {#if selected}
    <i class={selected.icon}></i>
  {/if}

  {#snippet menu()}
    <h4>{localize('Sort')}</h4>
    {#each methods as method}
      <a
        class={[
          'sort-menu-option',
          { selected: method.key === currentMethodKey },
        ]}
        onclick={(ev) => onSortClicked(ev, method)}
      >
        <i class={method.icon}></i>
        {localize(method.label)}
      </a>
    {/each}
  {/snippet}
</ButtonWithOptionPanel>
