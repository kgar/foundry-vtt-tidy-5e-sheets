<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
    [key: string]: any;
  }

  let { children, ...rest }: Props = $props();
</script>

<div class="accordion {rest.class}">
  {@render children?.()}
</div>
