<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';
  import ClearableInput from './ClearableInput.svelte';

  interface Props {
    searchCriteria?: string;
    disabled?: boolean;
  }

  let { searchCriteria = $bindable(''), disabled = false }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<ClearableInput
  type="text"
  placeholder={localize('TIDY5E.COMMON.Search.Label')}
  bind:value={searchCriteria}
  {disabled}
  icon="fa-solid fa-magnifying-glass"
  tag="search"
/>
