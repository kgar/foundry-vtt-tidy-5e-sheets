<script lang="ts">
  export let item: any;
</script>

<div
  role="button"
  tabindex="0"
  class="item-image"
  style="--bg-image: url('/{item.img}')"
  on:click={(event) => item.use({}, { event })}
>
  <i class="fa fa-dice-d20" />
</div>

<style lang="scss">
  .item-image {
    flex: 0 0 1.5rem;
    height: 1.5rem;
    border-radius: 5px 0px 0px 5px;
    background-image: var(--bg-image);
    background-size: cover;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;

    i {
      color: var(--t5e-tertiary-color);
      font-size: 1.125rem;
      display: none;
    }

    &:hover i {
      color: var(--t5e-primary-font);
    }
  }
</style>
