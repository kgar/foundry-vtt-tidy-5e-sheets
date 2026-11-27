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

  function onOptionSelected(option: DialogOption<any>) {
    resolve(option.value);
    app.close();
  }

  const filteredOptions = $derived(
    searchCriteria.trim() === ''
      ? options
      : options.filter((o) =>
          o.label
            .toLocaleLowerCase()
            .includes(searchCriteria.toLocaleLowerCase()),
        ),
  );
</script>

<div class="dialog-content-container flexcol">
  <fieldset>
    {#if message}
      <p class="hint">
        {localize(message)}
      </p>
    {/if}

    <Search bind:searchCriteria />

    {#each filteredOptions as option}
      <button
        type="button"
        class="button"
        onclick={() => onOptionSelected(option)}
      >
        {localize(option.label)}
      </button>
    {/each}
  </fieldset>
</div>
