<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import LevelUpDropdown from 'src/sheets/classic/actor/LevelUpDropdown.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { EventHelper } from 'src/utils/events';
  import type { CharacterClassEntryContext } from 'src/types/types';
  import type { Item5e } from 'src/types/item.types';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let hitLevelCap = $derived(
    context.system.details.level >= CONFIG.DND5E.maxLevel,
  );

  let firstClass = $derived(context.classes[0]);
  let restClasses = $derived(context.classes.slice(1));
</script>

{#if firstClass}
  <div
    class="list-entry"
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
    data-item-id={firstClass?.item?.id}
  >
    <div class="list-label">
      <h4>
        {localize('TYPES.Item.class')}
      </h4>
    </div>

    {@render classContent(firstClass)}
  </div>
{/if}

{@render subclassRow(firstClass)}

{#each restClasses as cls (cls.uuid)}
  <div
    class="list-entry"
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
    data-item-id={cls?.item?.id}
  >
    <div class="list-label"></div>
    {@render classContent(cls)}
  </div>

  {@render subclassRow(cls)}
{/each}

{#if context.unlocked && !hitLevelCap}
  <div class="list-entry">
    <div class="list-label">
      {#if !firstClass}
        <h4>
          {localize('TYPES.Item.class')}
        </h4>
      {/if}
    </div>
    <div class="list-content">
      <div class="list-values">
        <button
          type="button"
          class="button button-borderless"
          data-tooltip="DND5E.ClassAdd"
          onclick={(ev) =>
            FoundryAdapter.createItem({ type: 'class' }, context.actor)}
        >
          {localize('DND5E.ClassAdd')}
        </button>
        <button
          type="button"
          class="button button-borderless button-icon-only"
          data-tooltip="DND5E.ClassAdd"
          onclick={(ev) =>
            context.actor.sheet.findItem({
              event: ev,
              type: 'class',
            })}
        >
          <i class="fa-solid fa-book-open-reader"></i>
        </button>
      </div>
    </div>
  </div>
{/if}

{#each context.orphanedSubclasses as subclass}
  {@render subclassListEntry(subclass, true)}
{/each}

{#snippet classContent(cls?: CharacterClassEntryContext)}
  <div class="list-content">
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
        {#if !context.unlocked}
          <span class="trait-class-level text-color-lighter">
            {@html localize('DND5E.LevelNumber', {
              level: `<span class="font-weight-label text-color-default">${cls.levels}</span>`,
            })}
          </span>
        {/if}
      {/if}
    </div>
    {#if context.unlocked && cls}
      <div class="list-controls">
        {#if context.unlocked}
          <LevelUpDropdown
            availableLevels={cls.availableLevels}
            item={cls.item}
            class="level-selector flex0"
          />
        {/if}
        <button
          type="button"
          class="button button-borderless button-icon-only button-level-up"
          data-tooltip="DND5E.LevelActionIncrease"
          disabled={hitLevelCap}
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
  </div>
{/snippet}

{#snippet subclassRow(cls?: CharacterClassEntryContext, orphaned?: boolean)}
  {#if cls?.subclass}
    {@render subclassListEntry(cls.subclass, orphaned)}
  {:else if cls?.needsSubclass}
    {@render needsSubclassListEntry(firstClass.item)}
  {/if}
{/snippet}

{#snippet subclassListEntry(subclass: Item5e, orphaned: boolean = false)}
  <div
    class="list-entry"
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
    data-item-id={subclass.id}
  >
    <div class="list-label"></div>
    <div class="list-content">
      <div class="list-values">
        {#if !orphaned}
          <i class="fa-solid fa-arrow-turn-down-right"></i>
        {:else}
          <i
            data-tooltip="DND5E.SubclassMismatchWarn"
            class="fa-solid fa-link-slash"
          ></i>
        {/if}
        <img src={subclass.img} alt={subclass.name} class="item-image flex0" />
        <span class="trait-name">
          {localize(subclass.name)}
        </span>
      </div>
      {#if context.unlocked}
        <div class="list-controls">
          <button
            type="button"
            class="button button-borderless button-icon-only"
            data-tooltip="DND5E.ItemEdit"
            onclick={() =>
              subclass.sheet.render({
                force: true,
                mode: CONSTANTS.SHEET_MODE_EDIT,
              })}
          >
            <i class="fa-solid fa-edit"></i>
          </button>
          <button
            type="button"
            class="button button-borderless button-icon-only"
            onclick={(ev) =>
              EventHelper.triggerContextMenu(ev, '[data-item-id]')}
          >
            <i class="fa-solid fa-ellipsis-vertical fa-fw"></i>
          </button>
        </div>
      {/if}
    </div>
  </div>
{/snippet}

{#snippet needsSubclassListEntry(cls: Item5e)}
  <div class="list-entry">
    <div class="list-label"></div>
    <div class="list-content">
      <div class="list-values">
        <button
          type="button"
          class="button button-borderless"
          onclick={() =>
            FoundryAdapter.createItem(
              {
                type: 'subclass',
                system: { classIdentifier: cls.system.identifier },
              },
              context.actor,
            )}
        >
          {localize('DND5E.SubclassAdd')}
        </button>
        <button
          type="button"
          class="button button-borderless button-icon-only"
          onclick={async (ev) =>
            await context.actor.sheet.findItem({
              event: ev,
              type: 'subclass',
              classIdentifier: cls.system.identifier,
            })}
        >
          <i class="fa-solid fa-book-open-reader"></i>
        </button>
      </div>
    </div>
  </div>
{/snippet}
