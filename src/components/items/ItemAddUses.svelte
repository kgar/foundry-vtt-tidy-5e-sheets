<script lang="ts">
  export let item: any;

  function onAddUses() {
    let data: Record<string, unknown> = {};
    data['system.uses.value'] = 1;
    data['system.uses.max'] = 1;

    item.update(data);
  }
</script>

<a
  class="item-add-uses"
  role="button"
  tabindex="0"
  on:click|preventDefault|stopPropagation={() => onAddUses()}
>
  Add
</a>

<style lang="scss">
  .item-add-uses {
    display: block;
    width: 100%;
    height: 100%;
    text-align: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      opacity: 1;
      color: var(--t5e-secondary-color);
    }
  }
</style>
