<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import LevelUpDropdown from 'src/sheets/classic/actor/LevelUpDropdown.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { EventHelper } from 'src/utils/events';
  import type { CharacterClassEntryContext } from 'src/types/types';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let firstClass = $derived(context.classes[0]);
  let restClasses = $derived(context.classes.slice(1));
</script>

<div
  class="list-entry"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-item-id={firstClass?.item?.id}
>
  <div class="list-label">
    <h4>
      {localize('TYPES.Item.class')}
    </h4>
    {#if context.unlocked}
      <button
        type="button"
        class="button button-borderless button-icon-only"
        data-tooltip="DND5E.ClassAdd"
        onclick={(ev) =>
          FoundryAdapter.showClassCompendiumBrowser(context.actor)}
      >
        <i class="fa-solid fa-plus"></i>
      </button>
    {/if}
  </div>

  {#if firstClass}
    {@render classValueControls(firstClass)}
  {:else}
    <div class="list-values"></div>
  {/if}
</div>

{#each restClasses as cls (cls.uuid)}
  <div class="list-entry">
    <div class="list-label"></div>
    {@render classValueControls(cls)}
  </div>
{/each}

{#snippet classValueControls(cls: CharacterClassEntryContext)}
  <div class="list-values trait-class trait-item">
    {#if cls}
      <img src={cls.img} alt={cls.name} class="item-image flex0" />
      <span class="trait-name">
        {localize(cls.name)}
      </span>
      {#if cls.isOriginalClass}
        <i
          class="flex0 fa-solid fa-chess-queen"
          data-tooltip="DND5E.ClassOriginal"
          aria-label={localize('DND5E.ClassOriginal')}
        ></i>
      {/if}
      {#if context.unlocked}
        <LevelUpDropdown
          availableLevels={cls.availableLevels}
          item={cls.item}
          class="level-selector"
        />
      {:else}
        <span class="trait-class-level">
          {@html localize('DND5E.LevelNumber', {
            level: `<span class="font-weight-label">${cls.levels}</span>`,
          })}
        </span>
      {/if}
      <div>
        <em
          >TODO: Handle Present and Missing Subclass; also handle right-click
          context menu for Class and Subclass</em
        >
      </div>
    {/if}
  </div>
  {#if context.unlocked && cls}
    <div class="list-controls">
      <button
        type="button"
        class="button button-borderless button-icon-only button-level-up"
        data-tooltip="DND5E.LevelActionIncrease"
        disabled={context.system.details.level >= CONFIG.DND5E.maxLevel}
        onclick={() => FoundryAdapter.changeLevel(context.actor, cls.item, 1)}
      >
        <i class="fa-solid fa-square-up"></i>
      </button>
      <button
        type="button"
        class="button button-borderless button-icon-only"
        data-tooltip="DND5E.ItemEdit"
        onclick={() =>
          cls.item.sheet.render({
            force: true,
            mode: CONSTANTS.SHEET_MODE_EDIT,
          })}
      >
        <i class="fa-solid fa-edit"></i>
      </button>
      <button
        type="button"
        class="button button-borderless button-icon-only"
        onclick={(ev) => EventHelper.triggerContextMenu(ev, '[data-item-id]')}
      >
        <i class="fa-solid fa-ellipsis-vertical fa-fw"></i>
      </button>
    </div>
  {/if}
{/snippet}
