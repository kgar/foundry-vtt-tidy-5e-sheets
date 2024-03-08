<script lang="ts">
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import type { ItemSheetContext } from 'src/types/item';
  import type { CharacterSheetContext } from 'src/types/types';
  import { warn } from 'src/utils/logging';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context =
    getContext<Readable<ItemSheetContext | CharacterSheetContext>>('context');

  $: effects = Object.entries($context.effects) as Iterable<[string, any]>;

  const localize = FoundryAdapter.localize;

  function onAddClicked(section: any) {
    const unsupported = FoundryAdapter.isFoundryV10() && $context.item.isOwned;
    if (unsupported)
      return warn(
        'Managing Active Effects within an Owned Item is not currently supported and will be added in a subsequent update.',
        true,
      );

    const owner = $context.item;

    return FoundryAdapter.addEffect(section.type, owner);
  }

  function handleMiddleClickToEdit(event: MouseEvent, effect: any) {
    if (event.button === CONSTANTS.MOUSE_BUTTON_AUXILIARY) {
      effect.sheet.render(true);
    }
  }

  function handleDragStart(event: DragEvent, effect: any) {
    if (!effect) {
      return;
    }

    const dragData = effect.toDragData();
    event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
  }
</script>

<ContentConcealer conceal={$context.concealDetails}>
  <ol
    class="items-list effects-list"
    on:drop={(ev) => $context.item.sheet._onDrop(ev)}
  >
    {#each effects as [_, section]}
      {#if !section.hidden}
        <li class="items-header flexrow" data-effect-type={section.type}>
          <h3 class="item-name effect-name flexrow">
            {localize(section.label)}
          </h3>
          <div class="effect-source">{localize('DND5E.Source')}</div>
          <div class="effect-source">{localize('DND5E.Duration')}</div>
          <div class="item-controls active-effect-controls flexrow">
            {#if $context.editable}
              <button
                type="button"
                class="active-effect-control inline-icon-button"
                title={localize('DND5E.EffectCreate')}
                on:click={(event) => onAddClicked(section)}
                tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
              >
                <i class="fas fa-plus" />
                {localize('DND5E.Add')}
              </button>
            {/if}
          </div>
        </li>

        {#if section.info}
          <ol class="info">
            {#each $context.section.info as info}
              <li class="notification info">{info ?? ''}</li>
            {/each}
          </ol>
        {/if}

        <ol class="item-list">
          {#each section.effects as effect}
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <li
              class="item effect flexrow"
              data-effect-id={effect.id}
              on:mousedown={(event) => handleMiddleClickToEdit(event, effect)}
              on:dragstart={(ev) => handleDragStart(ev, effect)}
              draggable={true}
            >
              <div class="item-name effect-name flexrow">
                <img
                  class="item-image"
                  src={effect.icon}
                  alt={effect.name ?? ''}
                />
                <h4>{effect.name ?? ''}</h4>
              </div>
              <div class="effect-source">{effect.sourceName ?? ''}</div>
              <div class="effect-duration">
                {effect.duration.label ?? ''}
              </div>
              <div class="item-controls active-effect-controls flexrow">
                {#if $context.editable}
                  <button
                    type="button"
                    class="active-effect-control inline-transparent-button"
                    title={effect.disabled
                      ? 'DND5E.EffectEnable'
                      : 'DND5E.EffectDisable'}
                    on:click={() =>
                      effect.update({ disabled: !effect.disabled })}
                    tabindex={$settingStore.useAccessibleKeyboardSupport
                      ? 0
                      : -1}
                  >
                    <i
                      class="fas"
                      class:fa-check={effect.disabled}
                      class:fa-times={!effect.disabled}
                    />
                  </button>
                  <button
                    type="button"
                    class="active-effect-control inline-transparent-button"
                    title={localize('DND5E.EffectEdit')}
                    on:click={() => effect.sheet.render(true)}
                    tabindex={$settingStore.useAccessibleKeyboardSupport
                      ? 0
                      : -1}
                  >
                    <i class="fas fa-edit" />
                  </button>
                  <button
                    type="button"
                    class="active-effect-control inline-transparent-button"
                    title={localize('DND5E.EffectDelete')}
                    on:click={() => effect.deleteDialog()}
                    tabindex={$settingStore.useAccessibleKeyboardSupport
                      ? 0
                      : -1}
                  >
                    <i class="fas fa-trash" />
                  </button>
                {/if}
              </div>
            </li>
          {/each}
        </ol>
      {/if}
    {/each}
  </ol>
</ContentConcealer>
