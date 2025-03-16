<script lang="ts">
  interface Props {
    toggleSummary: () => void;
    name: string;
    expanded: boolean;
  }

  let { toggleSummary, name, expanded }: Props = $props();
</script>

<a class="item-name" onclick={(ev) => toggleSummary()}>
  <span class="cell-name">{name}</span>
  <span class="row-detail-expand-indicator">
    <i class="fa-solid fa-angle-right expand-indicator" class:expanded> </i>
  </span>
</a>
