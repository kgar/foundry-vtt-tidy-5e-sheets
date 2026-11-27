<script lang="ts">
  import Search from 'src/sheets/quadrone/shared/Search.svelte';
  import type { DialogOption, Resolvable } from './tidy-dialog.types';
  import type { TidyDialog } from './TidyDialog.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  type Props = Resolvable & {
    app: TidyDialog;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    options: DialogOption<any>[];
    message?: string;
  };

  let { app, resolve, reject, options, message }: Props = $props();

  const localize = FoundryAdapter.localize;

  let searchCriteria = $state('');

  let selections = $state(
    // svelte-ignore state_referenced_locally
    options.map((o) => ({
      ...o,
      selected: true,
    })),
  );

  const filteredSelections = $derived(
    searchCriteria.trim() === ''
      ? selections
      : selections.filter((o) =>
          o.label
            .toLocaleLowerCase()
            .includes(searchCriteria.toLocaleLowerCase()),
        ),
  );

  const selectionCount = $derived(selections.filter((s) => s.selected).length);

  const allSelected = $derived(selections.length === selectionCount);

  function onConfirm() {
    resolve(selections.filter((s) => s.selected).map((s) => s.value));
    return app.close();
  }

  function toggleSelectAll(selected: boolean): any {
    selections.forEach((s) => {
      s.selected = selected;
    });
  }
</script>

<div class="dialog-content-container choose-multiple flexcol">
  <fieldset>
    {#if message}
      <p class="hint">
        {localize(message)}
      </p>
    {/if}

    <Search bind:searchCriteria />

    <div class="flexcol">
      <label class="select-all-toggle checkbox">
        <input
          type="checkbox"
          checked={allSelected}
          indeterminate={!allSelected && selectionCount > 0}
          onchange={(ev) => toggleSelectAll(ev.currentTarget.checked)}
        />
        {localize('TIDY5E.COMMON.Action.Options')}
      </label>
      {#each filteredSelections as option}
        <label class="checkbox option">
          <input type="checkbox" bind:checked={option.selected} />
          {localize(option.label)}
        </label>
      {/each}
    </div>
  </fieldset>
</div>

<div class="button-bar">
  <button
    autofocus
    class="button button-primary"
    type="button"
    onclick={onConfirm}
    disabled={selectionCount === 0}
  >
    <i class="fa-solid fa-check"></i>
    {localize('COMMON.Confirm')}
  </button>
</div>
