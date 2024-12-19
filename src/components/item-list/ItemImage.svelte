<script lang="ts">
  export let src: string;
  export let alt: string = '';
  export let classes: string = '';
</script>

<img class="item-image {classes}" {src} {alt} />

<style lang="scss">
  .item-image {
    flex: 0 0 var(--t5e-image-size-override, 1.5rem);
    height: var(--t5e-image-size-override, 1.5rem);
    border-radius: 0.3125rem 0 0 0.3125rem;
  }
</style>
