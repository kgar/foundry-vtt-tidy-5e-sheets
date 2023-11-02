<script lang="ts">
  export let src: string;
  export let alt: string = '';
</script>

<img class="item-image" {src} {alt} />

<style lang="scss">
  .item-image {
    flex: 0 0 1.5rem;
    height: 1.5rem;
    border-radius: 0.3125rem 0px 0rem 0.3125rem;
  }
</style>
