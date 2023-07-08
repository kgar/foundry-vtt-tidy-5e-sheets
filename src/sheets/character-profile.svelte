<script lang="ts">
  import {
    FoundryAdapter,
    type CharacterSheetContext,
  } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import type { SheetFunctions } from 'src/types/types';
  import Exhaustion from './exhaustion.svelte';
  import Inspiration from './inspiration.svelte';
  import HpOverlay from './hp-overlay.svelte';
  import DeathSaves from './death-saves.svelte';
  import Rest from './rest.svelte';
  import HitDice from './hit-dice.svelte';
  import HitPoints from './hit-points.svelte';
  import CharacterPortrait from './character-portrait.svelte';

  export let sheetFunctions: SheetFunctions;
  export let context: CharacterSheetContext;

  const portraitStyle = SettingsProvider.settings.portraitStyle.get();
  const useRoundedPortraitStyle = ['all', 'default', 'pc'].includes(
    portraitStyle
  );
  const incapacitated =
    (context.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
    context.actor?.system?.attributes?.hp?.max !== 0;

  function onLevelSelected(event: CustomEvent<{ level: number }>) {
    context.actor.update({
      'system.attributes.exhaustion': event.detail.level,
    });
  }

  function showDeathSaves(): boolean {
    const isEnabledForAll =
      !SettingsProvider.settings.hiddenDeathSavesEnabled.get();
    return incapacitated && (isEnabledForAll || FoundryAdapter.userIsGm());
  }
</script>

<!-- TODO: Resolve linting comments after done re-styling -->
<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="profile-wrap">
  <div class="profile" class:round-portrait={useRoundedPortraitStyle}>
    <CharacterPortrait actor={context.actor} {sheetFunctions} />

    {#if !SettingsProvider.settings.hpOverlayDisabled.get()}
      <HpOverlay {useRoundedPortraitStyle} actor={context.actor} />
    {/if}

    {#if showDeathSaves()}
      <DeathSaves
        successes={context.system.attributes.death.success}
        failures={context.system.attributes.death.failure}
        {useRoundedPortraitStyle}
        on:rollDeathSave={(event) =>
          context.actor.rollDeathSave({ event: event.detail.mouseEvent })}
      />
    {/if}

    {#if !SettingsProvider.settings.exhaustionDisabled.get() && !incapacitated}
      <Exhaustion
        level={context.system.attributes.exhaustion}
        radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-left'}
        on:levelSelected={onLevelSelected}
        onlyShowOnHover={SettingsProvider.settings.exhaustionOnHover.get() ||
          (SettingsProvider.settings.hideIfZero.get() &&
            context.system.attributes.exhaustion === 0)}
      />
    {/if}

    {#if !SettingsProvider.settings.inspirationDisabled.get() && !incapacitated}
      <Inspiration
        inspired={context.actor.system.attributes.inspiration}
        radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-right'}
        onlyShowOnHover={SettingsProvider.settings.inspirationOnHover.get()}
        disableAnimation={SettingsProvider.settings.inspirationAnimationDisabled.get()}
      />
    {/if}

    <HitPoints
      value={context.system.attributes.hp.value}
      max={context.system.attributes.hp.max}
      actor={context.actor}
      {useRoundedPortraitStyle}
      {incapacitated}
    />

    {#if !incapacitated}
      <Rest {sheetFunctions} {useRoundedPortraitStyle} />
    {/if}

    {#if !incapacitated}
      <HitDice
        hitDice={context.system.attributes.hd}
        actorLevel={context.system.details.level}
        actor={context.actor}
        {useRoundedPortraitStyle}
      />
    {/if}
  </div>
</div>

<style lang="scss">
</style>
