<script lang="ts">
  import { TidyFlags } from 'src/api';
  import { isItemInActionList } from 'src/features/actions/actions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    doc: any;
  }

  let { doc }: Props = $props();

  const localize = FoundryAdapter.localize;

  let included = $derived(isItemInActionList(doc));

  let tooltip = $derived(
    localize(
      included
        ? '(LOCALIZE) Remove from Sheet Tab'
        : '(LOCALIZE) Add to Sheet tab',
    ),
  );

  function toggleBookmark() {
    TidyFlags.actionFilterOverride.set(doc, !included);
  }
</script>

<a class="tidy-table-button" data-tooltip={tooltip} onclick={toggleBookmark}>
  {#if included}
    <i class="fa-solid fa-thumbtack fa-fw"></i>
  {:else}
    <i class="fa-light fa-thumbtack fa-fw"></i>
  {/if}
</a>
