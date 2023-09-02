<script lang="ts">
  export let item: any;
  export let imgUrlOverride: string | undefined = undefined;
</script>

<div
  role="button"
  tabindex="0"
  class="item-use-button"
  style="--bg-image: url('/{imgUrlOverride ?? item.img}')"
  on:click={(event) => item.use({}, { event })}
>
  <i class="fa fa-dice-d20" />
</div>

<style lang="scss">
  .item-use-button {
    flex: 0 0 1.5rem;
    height: 1.5rem;
    border-radius: 0.3125rem 0 0 0.3125rem;
    background-image: var(--bg-image);
    background-size: cover;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;

    i {
      color: var(--t5ek-tertiary-color);
      font-size: 1.125rem;
      display: none;
    }

    &:hover i {
      color: var(--t5ek-primary-font-color);
    }
  }
</style>
