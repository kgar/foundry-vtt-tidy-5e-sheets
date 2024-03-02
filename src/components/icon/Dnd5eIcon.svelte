<script lang="ts">
  export let src: string;
</script>

{#key src}
  <dnd5e-icon {src} {...$$props} />
{/key}
