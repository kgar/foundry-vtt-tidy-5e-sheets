<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import {
    FoundryAdapter,
    type CharacterSheetContext,
  } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import type { SheetFunctions } from 'src/types/types';
  import Exhaustion from './exhaustion.svelte';
  import Inspiration from './inspiration.svelte';

  export let sheetFunctions: SheetFunctions;
  export let context: CharacterSheetContext;
  let showPortraitMenu = false;

  const localize = FoundryAdapter.localize;

  function openPortraitPicker(target: HTMLElement) {
    const rect = target.getBoundingClientRect();
    const current = foundry.utils.getProperty(context.actor, 'img');
    const fp = new FilePicker({
      type: 'image',
      current,
      callback: (path) => {
        target.src = path;
        sheetFunctions.submit();
        context.actor.update({ img: path });
      },
      top: rect.top + 40,
      left: rect.left + 10,
    });
    return fp.browse();
  }

  function onPortraitClick(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement }
  ) {
    switch (event.button) {
      case CONSTANTS.MOUSE_BUTTON_MAIN:
        // showPortraitMenu = false;
        openPortraitPicker(event.currentTarget);
        break;
      case CONSTANTS.MOUSE_BUTTON_AUXILIARY:
        break;
      case CONSTANTS.MOUSE_BUTTON_SECONDARY:
        showPortraitMenu = !showPortraitMenu;
        break;
    }
  }

  const portraitStyle = SettingsProvider.settings.portraitStyle.get();
  const useRoundedPortraitStyle = ['all', 'default', 'pc'].includes(
    portraitStyle
  );
</script>

<!-- TODO: Resolve linting comments after done re-styling -->
<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="profile-wrap">
  <div class="profile" class:round-portrait={useRoundedPortraitStyle}>
    <div class="portrait">
      <img
        class="player-image"
        src={context.actor.img}
        alt={context.actor.name}
        title={localize('T5EK.EditActorImage') +
          ' / ' +
          localize('T5EK.ShowActorImage')}
        on:mousedown={onPortraitClick}
      />
      {#if showPortraitMenu}
        <div class="portrait-menu">
          <a
            class="portrait-menu-item"
            on:click={() =>
              new ImagePopout(context.actor.img, {
                title: 'Portrait: ' + context.actor.name,
                shareable: true,
                uuid: context.actor.uuid,
              }).render(true)}>{localize('T5EK.ShowPortraitArt')}</a
          >
          <a
            class="portrait-menu-item"
            on:click={() =>
              new ImagePopout(context.actor.prototypeToken.texture.src, {
                title: 'Portrait: ' + context.actor.name,
                shareable: true,
                uuid: context.actor.uuid,
              }).render(true)}>{localize('T5EK.ShowTokenArt')}</a
          >
        </div>
      {/if}
    </div>

    <!-- Death Saves -->
    <i class="fas fa-check" />
    <input
      type="text"
      name="system.attributes.death.success"
      data-dtype="Number"
      placeholder="0"
      value={context.system.attributes.death.success}
      maxlength="1"
      data-tooltip={localize('T5EK.DeathSave')}
    />

    <div on:click={(event) => context.actor.rollDeathSave({ event })}>
      <i class="fas fa-skull" />
    </div>

    <input
      type="text"
      name="system.attributes.death.failure"
      data-dtype="Number"
      placeholder="0"
      value={context.system.attributes.death.failure}
      maxlength="1"
    />
    <i class="fas fa-times" />

    <Exhaustion
      level={context.system.attributes.exhaustion}
      radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={(event) =>
        context.actor.update({
          'system.attributes.exhaustion': event.detail.level,
        })}
      onlyShowOnHover={SettingsProvider.settings.exhaustionOnHover.get() ||
        (SettingsProvider.settings.hideIfZero.get() &&
          context.system.attributes.exhaustion === 0)}
    />

    {#if !SettingsProvider.settings.inspirationDisabled.get()}
      <Inspiration
        inspired={context.actor.system.attributes.inspiration}
        radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-right'}
        onlyShowOnHover={SettingsProvider.settings.inspirationOnHover.get()}
        disableAnimation={SettingsProvider.settings.inspirationAnimationDisabled.get()}
      />
    {/if}

    <!-- Short/Long Rest -->
    <div>
      <span data-tooltip={localize('T5EK.RestHint')}>
        <i class="fas fa-bed" />
      </span>
      <span
        data-tooltip={localize('T5EK.RestS')}
        on:click={(event) => sheetFunctions.onShortRest(event)}
      >
        <i class="fas fa-hourglass-half" />
      </span>
      <span
        data-tooltip={localize('T5EK.RestL')}
        on:click={(event) => sheetFunctions.onLongRest(event)}
      >
        <i class="fas fa-hourglass-end" />
      </span>
    </div>

    <!-- HP / HP Max -->
    <input
      name="system.attributes.hp.value"
      type="text"
      value={context.system.attributes.hp.value}
      placeholder="10"
      data-tooltip={localize('DND5E.HitPointsCurrent')}
      data-dtype="Number"
      maxlength="5"
      aria-describedby="tooltip"
    />
    <span> / </span>
    <!-- TODO: Implement "Allow Max HP Override" / T5EK.Settings.AllowHpMaxOverride -->
    <span
      data-tooltip={context.system.attributes.hp.max
        ? localize('DND5E.HitPointsOverride')
        : localize('DND5E.HitPointsMax')}
    >
      {context.system.attributes.hp.max}</span
    >
    <a
      data-tooltip={localize('DND5E.HitPointsConfig')}
      on:click={new dnd5e.applications.actor.ActorHitPointsConfig(
        context.actor
      ).render(true)}
    >
      <i class="fas fa-cog" />
    </a>

    <!-- Hit Dice -->
    <div
      data-tooltip="{localize('DND5E.HitDice')}: {context.system.attributes
        .hd}/{context.system.details.level}&#10;{localize(
        'DND5E.HitDiceConfig'
      )}"
    >
      <a
        on:click={new dnd5e.applications.actor.ActorHitDiceConfig(
          context.actor
        ).render(true)}>{context.system.attributes.hd}</a
      >
    </div>
  </div>
</div>

<style lang="scss">
</style>
