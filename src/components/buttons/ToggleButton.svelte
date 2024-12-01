<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  interface Props {
    checked?: boolean;
    disabled?: boolean;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    checked = false,
    disabled = false,
    children,
    ...rest
  }: Props = $props();
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<label class="button toggle-button {rest.class ?? ''}" class:disabled>
  {@render children?.()}
  <input
    type="checkbox"
    class="hidden toggle"
    {checked}
    onchange={bubble('change')}
  />
</label>
