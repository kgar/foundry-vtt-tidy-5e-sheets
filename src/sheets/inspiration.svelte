<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import type { PortraitCharmRadiusClass } from 'src/types/types';

  export let inspired: boolean;
  export let cssClass: string = '';
  export let radiusClass: PortraitCharmRadiusClass;

  const localize = FoundryAdapter.localize;
  const disableAnimation =
    SettingsProvider.settings.inspirationAnimationDisabled.get();
</script>

<div
  class="inspiration has-note inspiration-{inspired ? 1 : 0} {cssClass}"
  data-tooltip={localize('DND5E.Inspiration')}
>
  <label class:inspired class={radiusClass}>
    <input
      type="checkbox"
      name="system.attributes.inspiration"
      data-dtype="Boolean"
      checked={inspired}
    />
    <i
      class="inspiration-icon fas fa-dice-d20"
      class:disable-animation={disableAnimation}
    />
  </label>
</div>

<style lang="scss">
  .inspiration {
    position: absolute;
    right: 0;
    top: 0px;
    width: 34px;
    height: 34px;
    z-index: 5;
  }

  .inspiration input {
    display: none;
  }

  .inspiration label {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: var(--t5e-icon-font);
    cursor: pointer;
    box-shadow: 0 0 10px var(--t5e-icon-shadow) inset;
    border: 1px solid var(--t5e-icon-outline);
    background: var(--t5e-icon-background);
  }

  .round-portrait .inspiration label {
    border-radius: 50%;
  }

  .inspiration label i {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    text-align: center;
    line-height: 34px;
  }

  .inspiration label:hover {
    color: rgba(255, 255, 255, 0.75);
    text-shadow: 0 0 5px rgba(118, 228, 255, 0.5);
  }

  .inspiration-1 label {
    color: rgba(255, 255, 255, 1);
    text-shadow: 0 0 10px rgba(118, 228, 255, 1);
    background: #999;
  }

  .inspiration-1 label i {
    color: #ffffff;
    animation: glow 5s ease-in-out infinite alternate;
  }

  i.disable-animation {
    animation: none;
  }

  @keyframes glow {
    0% {
      transform: scale(1);
      text-shadow: 0 0 10px 6px #76e4ff;
    }
    25% {
      transform: scale(1.2);
      text-shadow: 0 0 12px 8px #76e4ff;
    }
    60% {
      transform: scale(1);
      text-shadow: 0 0 8px 4px #76e4ff;
    }
    100% {
      transform: scale(1.1);
      text-shadow: 0 0 11px 7px #76e4ff;
    }
  }
</style>
