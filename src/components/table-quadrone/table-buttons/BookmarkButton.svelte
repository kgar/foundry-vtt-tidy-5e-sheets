<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    doc: any;
  }

  let { doc }: Props = $props();

  const localize = FoundryAdapter.localize;

  let bookmarked = false; // TODO

  function toggleBookmark() {
    alert('todo');
  }
</script>

<a
  class="tidy-table-button"
  title="TODO: Localize 'Add Bookmark' and 'Remove Bookmark'"
  onclick={toggleBookmark}
>
  {#if bookmarked}
    <i class="fa-solid fa-bookmark fa-fw"></i>
  {:else}
    <i class="fa-light fa-bookmark fa-fw"></i>
  {/if}
</a>
