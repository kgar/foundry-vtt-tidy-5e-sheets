<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store =
    getContext<Readable<ItemSheetContext | ActorSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  function onAddClicked(section: any) {
    const unsupported = game.dnd5e.isV10 && $store.item.isOwned;
    if (unsupported)
      return ui.notifications.warn(
        'Managing Active Effects within an Owned Item is not currently supported and will be added in a subsequent update.'
      );

    const owner = $store.item;

    return owner.createEmbeddedDocuments('ActiveEffect', [
      {
        label: game.i18n.localize('DND5E.EffectNew'),
        icon: 'icons/svg/aura.svg',
        origin: owner.uuid,
        'duration.rounds': section.type === 'temporary' ? 1 : undefined,
        disabled: section.type === 'inactive',
      },
    ]);
  }

  function handleMiddleClickToEdit(event: MouseEvent, effect: any) {
    if (event.button === CONSTANTS.MOUSE_BUTTON_AUXILIARY) {
      effect.sheet.render(true);
    }
  }
</script>

<ol class="items-list effects-list">
  {#each Object.entries($store.effects) as [_, section]}
    {#if !section.hidden}
      <li class="items-header flexrow" data-effect-type={section.type}>
        <h3 class="item-name effect-name flexrow">{localize(section.label)}</h3>
        <div class="effect-source">{localize('DND5E.Source')}</div>
        <div class="effect-source">{localize('DND5E.Duration')}</div>
        <div class="item-controls active-effect-controls flexrow">
          {#if $store.editable}
            <a
              class="active-effect-control"
              data-tooltip="DND5E.EffectCreate"
              on:click={(event) => onAddClicked(section)}
            >
              <i class="fas fa-plus" />
              {localize('DND5E.Add')}
            </a>
          {/if}
        </div>
      </li>

      {#if section.info}
        <ol class="info">
          {#each $store.section.info as info}
            <li class="notification info">{info}</li>
          {/each}
        </ol>
      {/if}

      <ol class="item-list">
        {#each section.effects as effect}
          <li
            class="item effect flexrow"
            data-effect-id={effect.id}
            on:mousedown={(event) => handleMiddleClickToEdit(event, effect)}
          >
            <div class="item-name effect-name flexrow">
              <img class="item-image" src={effect.icon} />
              <h4>{effect.label}</h4>
            </div>
            <div class="effect-source">{effect.sourceName}</div>
            <div class="effect-duration">{effect.duration.label}</div>
            <div class="item-controls active-effect-controls flexrow">
              {#if $store.editable}
                <a
                  class="active-effect-control"
                  data-tooltip={effect.disabled
                    ? 'DND5E.EffectEnable'
                    : 'DND5E.EffectDisable'}
                  on:click={() => effect.update({ disabled: !effect.disabled })}
                >
                  <i
                    class="fas"
                    class:fa-check={effect.disabled}
                    class:fa-times={!effect.disabled}
                  />
                </a>
                <a
                  class="active-effect-control"
                  data-tooltip="DND5E.EffectEdit"
                  on:click={() => effect.sheet.render(true)}
                >
                  <i class="fas fa-edit" />
                </a>
                <a
                  class="active-effect-control"
                  data-tooltip="DND5E.EffectDelete"
                  on:click={() => effect.delete()}
                >
                  <i class="fas fa-trash" />
                </a>
              {/if}
            </div>
          </li>
        {/each}
      </ol>
    {/if}
  {/each}
</ol>
