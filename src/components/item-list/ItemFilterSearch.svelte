<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/actor';
  import { onMount } from 'svelte';

  const localize = FoundryAdapter.localize;

  export let searchCriteria: string = '';
  export let actor: Actor5e;
  export let searchFlag: string;
  export let cssClass: string = '';
  export let placeholder: string;

  async function rememberSearch() {
    await FoundryAdapter.setFlag(actor, searchFlag, searchCriteria);
  }

  async function clearSearch() {
    await FoundryAdapter.setFlag(actor, searchFlag, '');
    searchCriteria = '';
  }

  onMount(() => {
    searchCriteria = FoundryAdapter.tryGetFlag(actor, searchFlag) ?? '';
  });
</script>

<li class="filter-search {cssClass}" title={localize('T5EK.SearchHint')}>
  <input
    type="text"
    {placeholder}
    bind:value={searchCriteria}
    on:blur|preventDefault|stopPropagation={() => rememberSearch()}
  />
  <button
    type="button"
    class="clear-search inline-icon-button"
    title={localize('T5EK.SearchClear')}
    style:display={searchCriteria === '' ? 'none' : undefined}
    on:click|preventDefault|stopPropagation={() => clearSearch()}
    ><i class="fas fa-times-circle" /></button
  >
</li>

<style lang="scss">
  .filter-search {
    display: flex;
    border: 0.0625rem solid var(--t5ek-light-color);
    border-bottom: none;
    border-radius: 0.1875rem 0.1875rem 0 0;
    margin: -0.125rem 0 0 0.25rem;
    font-size: 0.75rem;

    input {
      padding: 0 0.25rem 0.125rem 0.25rem;
      width: 8.75rem;
      &::placeholder {
        color: var(--t5ek-secondary-color);
      }
    }

    .clear-search {
      display: flex;
      align-items: center;
      margin: 0 0.1875rem 0 0;
      cursor: pointer;
    }
  }
</style>
