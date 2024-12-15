<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    cssClass?: string;
    children?: Snippet;
  }

  let { cssClass = '', children }: Props = $props();
</script>

<li class="button-menu-item {cssClass}">
  {@render children?.()}
</li>
