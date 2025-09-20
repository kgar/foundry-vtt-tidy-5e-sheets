<script lang="ts">
  import { TidyFlags } from 'src/api';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    doc: any;
  }

  let { doc }: Props = $props();

  const localize = FoundryAdapter.localize;

  let include = true; // undefined defaults to true
</script>

<a
  class="tidy-table-button tidy-table-toggle"
  aria-label={FoundryAdapter.localize(
    include
      ? 'TIDY5E.Encounter.Combat.IncludeInCombat.Tooltip'
      : 'TIDY5E.Encounter.Combat.ExcludeFromCombat.Tooltip',
  )}
  data-tooltip
  onclick={() => alert('TODO: Adjust included/excluded members as a flag on the encounter sheet.')}
>
  {#if include}
    <i class="fa-solid fa-toggle-large-on enabled"></i>
  {:else}
    <i class="fa-solid fa-toggle-off"></i>
  {/if}
</a>
