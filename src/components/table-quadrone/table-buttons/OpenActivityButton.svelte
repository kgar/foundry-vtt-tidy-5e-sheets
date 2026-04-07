<script lang="ts">
  interface Props {
    doc: any;
  }

  let { doc: item }: Props = $props();
</script>

{#if item.system.linkedActivity}
  <a
    class="tidy-table-button"
    data-tooltip={'DOCUMENT.DND5E.Activity'}
    onclick={() =>
      (item.parent ?? item).sheet._renderChild(
        item.system.linkedActivity.sheet,
      )}
  >
    <i class="fa-solid fa-cog fa-fw"></i>
  </a>
{/if}
