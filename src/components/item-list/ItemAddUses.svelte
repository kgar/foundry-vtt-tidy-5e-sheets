<script lang="ts">
  import { CONSTANTS } from 'src/constants';

  export let item: any;

  function onAddUses() {
    let data: Record<string, unknown> = {};
    data['system.uses.value'] = 1;
    data['system.uses.max'] = '1';
    data['system.uses.per'] = CONSTANTS.LIMITED_USES_PER_CHARGES;

    if (item.system.activation?.type === null) {
      data['system.activation.type'] = CONSTANTS.ACTIVATION_COST_ACTION;
    }

    item.update(data);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<a
  class="item-add-uses item-list-button"
  class:disabled={!item.isOwner}
  on:click={() => item.isOwner && onAddUses()}
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
