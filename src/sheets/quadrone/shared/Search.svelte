<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';

  interface Props {
    searchCriteria?: string;
    disabled?: boolean;
  }

  let { searchCriteria = $bindable(''), disabled = false }: Props = $props();

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
    <a class="cancel-search" onclick={() => (searchCriteria = '')}>
      <i class="fas fa-xmark-large fa-fw"></i>
    </a>
  {/if}
</search>
