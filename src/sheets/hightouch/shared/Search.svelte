<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';

  export let searchCriteria: string = '';
  export let disabled = false;

  const localize = FoundryAdapter.localize;
</script>

<search>
  <span class="icon-and-input">
    <i class="fas fa-magnifying-glass fa-fw"></i>
    <input
      type="text"
      placeholder={localize('TIDY5E.Search')}
      bind:value={searchCriteria}
      {disabled}
    />
  </span>
  {#if !isNil(searchCriteria, '')}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a class="cancel-search" on:click={() => (searchCriteria = '')}>
      <i class="fas fa-x fa-fw"></i>
    </a>
  {/if}
</search>
