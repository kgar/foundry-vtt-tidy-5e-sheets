<script lang="ts">
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemSheetContext } from 'src/types/item.types';
  import type { CharacterSheetContext } from 'src/types/types';

  let context =
    $derived(getSheetContext<ItemSheetContext | CharacterSheetContext>());

  let effects = $derived(
    Object.entries(context.effects) as Iterable<[string, any]>,
  );

  const localize = FoundryAdapter.localize;

  function onAddClicked(section: any) {
    const owner = context.item;
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

<ContentConcealer conceal={context.concealDetails}>
  <ol
    class="items-list effects-list"
    ondrop={(ev) => context.item.sheet._onDrop(ev)}
  >
    {#each effects as [_, section]}
      {@const effectEntries = section.effects.map((effect: any) => ({
        effect,
      }))}

      {#if !section.hidden}
        <li class="items-header flexrow" data-effect-type={section.type}>
          <h3 class="item-name effect-name flexrow">
            {localize(section.label)}
          </h3>
          <div class="effect-source">
            {localize('DND5E.SOURCE.FIELDS.source.label')}
          </div>
          <div class="effect-source">{localize('DND5E.Duration')}</div>
          <div class="item-controls active-effect-controls flexrow">
            {#if context.editable}
              <button
                type="button"
                class="active-effect-control inline-icon-button"
                title={localize('DND5E.EffectCreate')}
                onclick={(event) => onAddClicked(section)}
                tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
              >
                <i class="fas fa-plus"></i>
                {localize('DND5E.Add')}
              </button>
            {/if}
          </div>
        </li>

        {#if section.info}
          <ol class="info">
            {#each section.info as info}
              <li class="notification info">{info ?? ''}</li>
            {/each}
          </ol>
        {/if}

        <ol class="item-list">
          {#each effectEntries as { effect }}
            <li
              class="item effect flexrow"
              data-effect-id={effect.id}
              onmousedown={(event) => handleMiddleClickToEdit(event, effect)}
              ondragstart={(ev) => handleDragStart(ev, effect)}
              draggable={context.editable}
              data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS}
            >
              <div class="item-name effect-name flexrow">
                <img
                  class="item-image"
                  src={effect.img ?? effect.icon}
                  alt={effect.name ?? ''}
                />
                <span class="truncate" title={effect.name ?? ''}>
                  {effect.name ?? ''}
                </span>
              </div>
              <div
                class="effect-source truncate"
                title={effect.sourceName ?? ''}
              >
                {effect.sourceName ?? ''}
              </div>
              <div
                class="effect-duration truncate"
                title={effect.duration.label ?? ''}
              >
                {effect.duration.label ?? ''}
              </div>
              <div class="item-controls active-effect-controls flexrow">
                {#if context.editable}
                  {#if section.type !== 'enchantment'}
                    <button
                      type="button"
                      class="active-effect-control inline-icon-button"
                      title={effect.disabled
                        ? 'DND5E.EffectEnable'
                        : 'DND5E.EffectDisable'}
                      onclick={() =>
                        effect.update({ disabled: !effect.disabled })}
                      tabindex={settings.value.useAccessibleKeyboardSupport
                        ? 0
                        : -1}
                    >
                      <i
                        class="fas"
                        class:fa-check={effect.disabled}
                        class:fa-times={!effect.disabled}
                      ></i>
                    </button>
                  {/if}
                  <button
                    type="button"
                    class="active-effect-control inline-icon-button"
                    title={localize('DND5E.EffectEdit')}
                    onclick={() => effect.sheet.render(true)}
                    tabindex={settings.value.useAccessibleKeyboardSupport
                      ? 0
                      : -1}
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    type="button"
                    class="active-effect-control inline-icon-button"
                    title={localize('DND5E.EffectDelete')}
                    onclick={() => effect.deleteDialog()}
                    tabindex={settings.value.useAccessibleKeyboardSupport
                      ? 0
                      : -1}
                  >
                    <i class="fas fa-trash"></i>
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
