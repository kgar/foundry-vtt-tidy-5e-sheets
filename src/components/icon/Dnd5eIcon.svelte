<!--
 @component
 A wrapper for the system-specific `<dnd5e-icon />` element. 
 At the time of this writing, the component does not change images when the `src`
 attribute is changed, so re-rendering is required each time the `src` changes.
 -->

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    src: string;
  }

  let { src, ...props }: Props = $props();
</script>

{#key src}
  <dnd5e-icon {src} {...props}></dnd5e-icon>
{/key}
