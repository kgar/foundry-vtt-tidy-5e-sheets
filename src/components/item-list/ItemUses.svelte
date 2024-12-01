<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    item: any;
  }

  let { item }: Props = $props();

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
    onchange={(event) => {
      event.preventDefault();
      event.stopPropagation();
      FoundryAdapter.handleItemUsesChanged(event, item);
    }}
    disabled={!item.isOwner}
    onfocus={(ev) => ev.currentTarget.select()}
    data-tidy-field="system.uses.value"
  />
  /
  <input
    class="uses-max"
    type="text"
    value={item.system.uses.max}
    onchange={(event) => {
      event.preventDefault();
      event.stopPropagation();
      onUsesMaxChanged(event, item);
    }}
    disabled={!item.isOwner}
    onfocus={(ev) => ev.currentTarget.select()}
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
