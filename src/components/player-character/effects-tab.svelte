<script lang="ts">
  import {
    FoundryAdapter,
    type CharacterSheetContext,
  } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import { createEventDispatcher, onMount } from 'svelte';

  export let context: CharacterSheetContext;
  export let scrollTop: number;

  const localize = FoundryAdapter.localize;

  const effectSections = Object.values<any>(context.effects);
  const allowEdit = FoundryAdapter.tryGetFlag<boolean>(
    context.actor,
    'allow-edit'
  );
  const classicControlsEnabled =
    SettingsProvider.settings.classicControlsEnabled.get();

  const dispatcher = createEventDispatcher<{
    scrollTopChanged: { top: number };
  }>();

  let scrollView: HTMLElement;

  onMount(() => {
    scrollView.scrollTop = scrollTop ?? 0;
  });

  function addEffect(effectType: string): any {
    context.actor.createEmbeddedDocuments('ActiveEffect', [
      {
        label: game.i18n.localize('DND5E.EffectNew'),
        icon: 'icons/svg/aura.svg',
        origin: context.actor.uuid,
        'duration.rounds': effectType === 'temporary' ? 1 : undefined,
        disabled: effectType === 'inactive',
      },
    ]);
  }
</script>

<div class="list-layout">
  <ul
    class="tidy5e-items-list effects-list"
    class:unlocked={FoundryAdapter.tryGetFlag(context.actor, 'allow-edit')}
    on:scroll={(event) =>
      dispatcher('scrollTopChanged', { top: event.currentTarget.scrollTop })}
    bind:this={scrollView}
  >
    {#each effectSections as section}
      {#if allowEdit || section.effects.length > 0}
        <li class="items-header effects-header" data-effect-type={section.type}>
          <h3 class="item-name effect-name">{localize(section.label)}</h3>
          <div class="items-header-labels">
            <div class="items-header-source">
              <span>{localize('DND5E.Source')}</span>
            </div>
            <div class="items-header-duration">
              {localize('DND5E.Duration')}
            </div>
            {#if classicControlsEnabled}
              <div class="items-header-controls" />
            {/if}
          </div>
        </li>

        <ul class="tidy5e-item-list">
          {#each section.effects as effect}
            <li class="item effect" data-effect-id={effect.id}>
              <div class="item-name effect-name">
                <img class="item-image" src={effect.icon} />
                <h4>{effect.label}</h4>
              </div>
              <div class="item-detail effect-source" title={effect.sourceName}>
                <span>{effect.sourceName}</span>
              </div>
              <div class="item-detail effect-duration">
                {effect.duration.label}
              </div>
              {#if context.owner && classicControlsEnabled}
                <div class="item-controls tidy5e-kgar-effect-controls flexrow">
                  {#if context.editable}
                    <a
                      class="effect-control"
                      on:click={() =>
                        effect.update({ disabled: !effect.disabled })}
                      title={effect.disabled
                        ? localize('DND5E.EffectEnable')
                        : localize('DND5E.EffectDisable')}
                    >
                      <i
                        class="fas {effect.disabled ? 'fa-check' : 'fa-times'}"
                      />
                    </a>
                    <a
                      class="effect-control effect-edit"
                      on:click={() => effect.sheet.render(true)}
                      title={localize('DND5E.EffectEdit')}
                    >
                      <i class="fas fa-edit" />
                    </a>
                    <a
                      class="effect-control effect-delete"
                      on:click={() => effect.delete()}
                      title={localize('DND5E.EffectDelete')}
                    >
                      <i class="fas fa-trash" />
                    </a>
                  {/if}
                </div>
              {/if}
            </li>
          {/each}
          {#if allowEdit}
            <li class="items-footer" data-effect-type={section.type}>
              <a
                class="effect-create effect-control"
                on:click={() => addEffect(section.type)}
              >
                <i class="fas fa-plus-circle" />
                {localize('DND5E.Add')}
              </a>
            </li>
          {/if}
        </ul>
      {/if}
    {/each}
  </ul>
</div>

<style lang="scss">
</style>
