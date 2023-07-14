<script lang="ts">
  import { clamp } from 'src/utils/numbers';

  export let item: any;

  function onUsesChanged(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
    item: any
  ) {
    const uses = clamp(
      0,
      parseInt(event.currentTarget.value),
      item.system.uses.max
    );
    event.currentTarget.value = uses.toString();
    return item.update({ 'system.uses.value': uses });
  }

  function onUsesMaxChanged(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
    item: any
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
    name="system.uses.value"
    type="text"
    value={item.system.uses.value}
    on:change|stopPropagation|preventDefault={(event) =>
      onUsesChanged(event, item)}
  />
  /
  <input
    class="uses-max"
    name="system.uses.max"
    type="text"
    value={item.system.uses.max}
    on:change|stopPropagation|preventDefault={(event) =>
      onUsesMaxChanged(event, item)}
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
