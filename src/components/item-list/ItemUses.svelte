<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { clamp } from 'src/utils/numbers';

  export let item: any;

  function onUsesMaxChanged(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
    item: any,
  ) {
    let uses = parseInt(event.currentTarget.value ?? item.system.uses.max ?? 0);

    if (isNaN(uses)) {
      uses = 0;
    }

    return item.update({ 'system.uses.max': uses });
  }
</script>

<div class="item-uses">
  <input
    class="uses-value"
    type="text"
    value={item.system.uses.value}
    on:change|stopPropagation|preventDefault={(event) =>
      FoundryAdapter.handleItemUsesChanged(event, item)}
    disabled={!item.isOwner}
    on:focus={(ev) => ev.currentTarget.select()}
    data-tidy-field="system.uses.value"
  />
  /
  <input
    class="uses-max"
    type="text"
    value={item.system.uses.max}
    on:change|stopPropagation|preventDefault={(event) =>
      onUsesMaxChanged(event, item)}
    disabled={!item.isOwner}
    on:focus={(ev) => ev.currentTarget.select()}
    data-tidy-field="system.uses.max"
  />
</div>

<style lang="scss">
  .item-uses {
    justify-self: center;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    input {
      width: 50%;
      padding: 0 0.125rem 0 0;
      color: var(--t5e-secondary-color);
      line-height: 1;
      height: 100%;

      &.uses-value {
        text-align: right;
      }

      &.uses-max {
        text-align: left;
      }
    }
  }
</style>
