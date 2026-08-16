<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    GroupSheetQuadroneContext,
  } from 'src/types/types';
  import ExpandCollapseButton from 'src/sheets/quadrone/shared/ExpandCollapseButton.svelte';
  import Search from 'src/sheets/quadrone/shared/Search.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    searchCriteria: string;
    tabId: string;
  }

  let { 
    searchCriteria = $bindable(), 
    tabId,
  }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context = $derived(getSheetContext<GroupSheetQuadroneContext>());

  let userIsGm = $derived(FoundryAdapter.userIsGm());

  let tab = $derived(context.tabs.find((t) => t.id === tabId));

  let tabName = $derived(localize(tab?.title ?? ''));
</script>

<section
  class="action-bar"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTION_BAR}
>
  <ExpandCollapseButton />

  <Search bind:searchCriteria />
    {#if userIsGm}
      <button type="button" class="button" data-action="takeBastionTurn">
        <i class="fa-solid fa-hand"></i>
        {localize('DND5E.Bastion.Action.BastionTurn')}
      </button>
    {/if}

    <button type="button" class="button" disabled>
      <i class="fa-solid fa-dice-d20"></i>
      {localize('TIDY5E.Bastion.Group.RollEvent.Label')}
    </button>

    {#if context.editable}
      <button
        type="button"
        class="button button-icon-only"
        data-action="configureTab"
        data-tab-id={tabId}
        title={localize('TIDY5E.ConfigureTab.Title', { tabName: tabName })}
        aria-label={localize('TIDY5E.ConfigureTab.Title', { tabName: tabName })}
        data-tooltip
      >
        <i class="fas fa-gear"></i>
      </button>
    {/if}
</section>
