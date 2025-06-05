<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    doc: any;
  }

  let { doc }: Props = $props();

  const localize = FoundryAdapter.localize;

  let canAttune = $derived(FoundryAdapter.isAttunementApplicable(doc));

  let attuned = $derived(doc.system.attuned);

  let title = $derived(
    localize(
      attuned
        ? 'DND5E.ContextMenuActionAttune'
        : 'DND5E.ContextMenuActionUnattune',
    ),
  );

  function toggleAttuned() {
    doc.update({
      'system.attuned': !attuned,
    });
  }
</script>

{#if canAttune}
  <a {title} onclick={toggleAttuned} class="tidy-table-button">
    {#if attuned}
      <i class="fa-solid fa-sun"></i>
    {:else}
      <i class="fa-light fa-sun"></i>
    {/if}
  </a>
{/if}
