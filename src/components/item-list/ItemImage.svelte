<script lang="ts">
  interface Props {
    src: string;
    alt?: string;
  }

  let { src, alt = '' }: Props = $props();
</script>

<img class="item-image" {src} {alt} />

<style lang="scss">
  .item-image {
    flex: 0 0 var(--t5e-image-size-override, 1.5rem);
    height: var(--t5e-image-size-override, 1.5rem);
    border-radius: 0.3125rem 0 0 0.3125rem;
  }
</style>
