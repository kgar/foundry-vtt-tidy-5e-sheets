<!--
 @component
 A wrapper for the system-specific `<dnd5e-icon />` element. 
 At the time of this writing, the component does not change images when the `src`
 attribute is changed, so re-rendering is required each time the `src` changes.
 -->

<script lang="ts">
  interface Props {
    src: string;
    [key: string]: any;
  }

  let { ...props }: Props = $props();
</script>

{#key props.src}
  <dnd5e-icon {...props}></dnd5e-icon>
{/key}
