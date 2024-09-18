<script lang="ts">
  import type { Activity5e } from 'src/foundry/dnd5e.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let activity: any;

  function onUsesMaxChanged(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
    activity: Activity5e,
  ) {
    let uses = parseInt(event.currentTarget.value ?? activity.uses.max ?? 0);

    if (isNaN(uses)) {
      uses = 0;
    }

    return activity.update({ 'uses.max': uses });
  }
</script>

<div class="activity-uses">
  <input
    class="uses-value"
    type="text"
    value={activity.uses.value}
    on:change|stopPropagation|preventDefault={(event) =>
      FoundryAdapter.handleActivityUsesChanged(event, activity)}
    disabled={!activity.item.isOwner}
    on:focus={(ev) => ev.currentTarget.select()}
    data-tidy-field="uses.value"
  />
  /
  <input
    class="uses-max"
    type="text"
    value={activity.uses.max}
    on:change|stopPropagation|preventDefault={(event) =>
      onUsesMaxChanged(event, activity)}
    disabled={!activity.item.isOwner}
    on:focus={(ev) => ev.currentTarget.select()}
    data-tidy-field="uses.max"
  />
</div>

<style lang="scss">
  .activity-uses {
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
