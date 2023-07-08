<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import { createEventDispatcher } from 'svelte';

  export let successes: number;
  export let failures: number;
  export let useRoundedPortraitStyle: boolean;

  const localize = FoundryAdapter.localize;
  const hpOverlayDisabled = SettingsProvider.settings.hpOverlayDisabled.get();

  const dispatcher = createEventDispatcher<{
    rollDeathSave: { mouseEvent: MouseEvent };
  }>();
</script>

<!-- Death Saves -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="death-saves" class:rounded={useRoundedPortraitStyle}>
  <div class="counter-value" class:show-backdrop={hpOverlayDisabled}>
    <i class="fas fa-check" />
    <input
      type="text"
      name="system.attributes.death.success"
      data-dtype="Number"
      placeholder="0"
      value={successes}
      maxlength="1"
      data-tooltip={localize('DND5E.DeathSave')}
    />
    <div
      class="death-save rollable has-note"
      on:click={(event) => dispatcher('rollDeathSave', { mouseEvent: event })}
    >
      <i class="fas fa-skull" />
    </div>
    <input
      type="text"
      name="system.attributes.death.failure"
      data-dtype="Number"
      placeholder="0"
      value={failures}
      maxlength="1"
    />
    <i class="fas fa-times" />
  </div>
</div>

<style lang="scss">
  .death-saves {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    text-shadow: 0 0 5px 1px #222;
  }

  .rounded {
    border-radius: 50%;
  }

  .counter-value {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;

    &.show-backdrop {
      background: rgba(255, 0, 0, 0.5);
      padding: 0 0.5rem;
      border-radius: 5px;
    }

    input {
      color: #fff;
      font-weight: 700;
      font-size: 16px;
      height: 19px;
      padding: 5px 4px 4px 4px;
      min-width: unset;
      text-align: center;
      width: 18px;

      &:hover {
        border-color: #fff;
      }
    }

    .death-save {
      position: relative;
      margin: 0 0.25rem;
      color: rgba(255, 255, 255, 0.75);
      font-size: 30px;
      transition: color 0.3s ease;

      &:hover {
        color: #fff;
      }
    }
  }
</style>
