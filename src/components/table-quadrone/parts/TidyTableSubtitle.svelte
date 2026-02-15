<script lang="ts">
  let { children = undefined } = $props();
</script>

<span class="cell-context">
  {@render children?.()}
</span>
