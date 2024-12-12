<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ChangeEventHandler } from 'svelte/elements';

  interface Props {
    checked?: boolean;
    disabled?: boolean;
    children?: Snippet;
    onchange?: ChangeEventHandler<HTMLInputElement>;
    [key: string]: any;
  }

  let {
    checked = false,
    disabled = false,
    children,
    onchange,
    ...rest
  }: Props = $props();
</script>

<label class="button toggle-button {rest.class ?? ''}" class:disabled>
  {@render children?.()}
  <input type="checkbox" class="hidden toggle" {checked} {onchange} />
</label>
