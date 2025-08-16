<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import LevelUpDropdown from 'src/sheets/classic/actor/LevelUpDropdown.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { EventHelper } from 'src/utils/events';
  import type {
    ActorClassEntryContext,
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';
  import type { Item5e } from 'src/types/item.types';

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  const localize = FoundryAdapter.localize;

  let hitLevelCap = $derived(
    context.system.details.level >= CONFIG.DND5E.maxLevel,
  );

  let firstClass = $derived(context.classes[0]);
  let restClasses = $derived(context.classes.slice(1));
</script>

{#if context.classes.length === 0}
  <div class="list-entry">
    <div class="list-label">
      <h4 class="font-weight-label">
        {localize('TYPES.Item.class')}
      </h4>
    </div>

    <div class="list-content">
      <div class="list-values trait-item empty-state-container empty-classes">
        <button
          aria-label="Add {localize('TYPES.Item.class')}"
          type="button"
          class="button button-tertiary"
          data-tooltip="DND5E.ClassAdd"
          onclick={(ev) =>
            context.actor.sheet.findItem({
              event: ev,
              type: 'class',
            })}
        >
          <i class="fa-solid fa-plus"></i>
          {localize('DND5E.ClassAdd')}
        </button>
      </div>
    </div>
  </div>
{:else}
  <!-- Primary class -->
  {#if firstClass}
    <div
      class="list-entry"
      data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
      data-item-id={firstClass?.item?.id}
    >
      <div class="list-label">
        <h4 class="font-weight-label">
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
          <h4 class="font-weight-label">
            {localize('TYPES.Item.class')}
          </h4>
        {/if}
      </div>
      <div class="list-content">
        <button
          aria-label="Browse for {localize('TYPES.Item.class')}"
          type="button"
          class="button button-secondary"
          data-tooltip="DND5E.ClassAdd"
          onclick={(ev) =>
            context.actor.sheet.findItem({
              event: ev,
              type: 'class',
            })}
        >
          <i class="fa-solid fa-book-open-reader"></i>
          {localize('DND5E.ClassAdd')}
        </button>
        <div class="list-values trait-item">
          <button
            aria-label="Add {localize('TYPES.Item.class')}"
            type="button"
            class="button {context.classes.length > 0
              ? 'button-secondary'
              : 'button-primary'}"
            data-tooltip="DND5E.ClassAdd"
            onclick={(ev) =>
              FoundryAdapter.createItem({ type: 'class' }, context.actor)}
          >
            <i class="fa-solid fa-plus"></i>
            {localize('TIDY5E.Class.Custom')}
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#each context.orphanedSubclasses as subclass}
    {@render subclassListEntry(subclass, true)}
  {/each}
{/if}

{#snippet classContent(cls?: ActorClassEntryContext)}
  <div class="list-content">
    <div class="class-item">
      <div class="flexrow">
        <div class="list-values trait-class trait-item">
          {#if cls}
            <a
              aria-label="View {localize('TYPES.Item.class')}"
              class="item-image-link"
              role="button"
              onclick={() =>
                cls.item.sheet.render({
                  force: true,
                  mode: CONSTANTS.SHEET_MODE_PLAY,
                })}
              onkeydown={(e) =>
                e.key === 'Enter' &&
                cls.item.sheet.render({
                  force: true,
                  mode: CONSTANTS.SHEET_MODE_PLAY,
                })}
            >
              <img src={cls.img} alt={cls.name} class="item-image flex0" />
            </a>
            <span class="trait-name font-label-medium">
              {cls.name}
            </span>
            {#if !context.unlocked}
              <div class="divider-dot"></div>
              <span
                class="trait-class-level color-text-lighter font-label-medium"
              >
                {@html localize('DND5E.LevelNumber', {
                  level: `</span><span class="font-data-medium color-text-default">${cls.levels}`,
                })}
              </span>
            {/if}
            {#if cls.isOriginalClass}
              <i
                class="flex0 fa-solid fa-chess-queen color-text-gold-emphasis icon-class-original"
                data-tooltip="DND5E.ClassOriginal"
                aria-label={localize('DND5E.ClassOriginal')}
              ></i>
            {/if}
          {/if}
        </div>
        {#if context.unlocked && cls}
          <div class="list-controls">
            <button
              aria-label="Edit {localize('TYPES.Item.class')}"
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
              aria-label="{localize('TYPES.Item.class')} Context Menu"
              type="button"
              class="button button-borderless button-icon-only"
              onclick={(ev) =>
                EventHelper.triggerContextMenu(ev, '[data-item-id]')}
            >
              <i class="fa-solid fa-ellipsis-vertical fa-fw"></i>
            </button>
          </div>
        {/if}
        {#if !context.unlocked && cls && !hitLevelCap}
          <div class="list-controls flexshrink">
            <button
              aria-label={localize('DND5E.LevelActionIncrease')}
              type="button"
              class="button button-borderless button-icon-only"
              data-tooltip="DND5E.LevelActionIncrease"
              disabled={hitLevelCap}
              onclick={() =>
                FoundryAdapter.changeLevel(context.actor, cls.item, 1)}
            >
              <i class="fa-solid fa-square-up"></i>
            </button>
          </div>
        {/if}
      </div>
      {#if context.unlocked && cls}
        <div class="flexrow">
          <div class="list-controls">
            <LevelUpDropdown
              availableLevels={cls.availableLevels}
              item={cls.item}
              class="level-selector flex0"
            />
            <button
              aria-label={localize('DND5E.LevelActionIncrease')}
              type="button"
              class="button button-primary button-level-up"
              data-tooltip="DND5E.LevelActionIncrease"
              disabled={hitLevelCap}
              onclick={() =>
                FoundryAdapter.changeLevel(context.actor, cls.item, 1)}
            >
              <i class="fa-solid fa-square-up"></i>
              {localize('DND5E.LevelActionIncrease')}
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/snippet}

{#snippet subclassRow(cls?: ActorClassEntryContext, orphaned?: boolean)}
  {#if cls?.subclass}
    {@render subclassListEntry(cls.subclass, orphaned)}
  {:else if cls?.needsSubclass}
    {@render needsSubclassListEntry(firstClass.item)}
  {/if}
{/snippet}

{#snippet subclassListEntry(subclass: Item5e, orphaned: boolean = false)}
  <div
    class="list-entry list-sub-entry"
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
    data-item-id={subclass.id}
  >
    <div class="list-label"></div>
    <div class="list-content">
      <div class="list-values">
        {#if !orphaned}
          <i class="sub-entry-icon fa-solid fa-arrow-turn-down-right"></i>
        {:else}
          <i
            data-tooltip="DND5E.SubclassMismatchWarn"
            class="fa-solid fa-link-slash"
          ></i>
        {/if}
        <a
          aria-label="View {localize('TYPES.Item.subclass')}"
          class="item-image-link"
          role="button"
          onclick={() =>
            subclass.sheet.render({
              force: true,
              mode: CONSTANTS.SHEET_MODE_PLAY,
            })}
          onkeydown={(e) =>
            e.key === 'Enter' &&
            subclass.sheet.render({
              force: true,
              mode: CONSTANTS.SHEET_MODE_PLAY,
            })}
        >
          <img
            src={subclass.img}
            alt={subclass.name}
            class="item-image flex0"
          />
        </a>
        <span class="trait-name font-label-medium">
          {localize(subclass.name)}
        </span>
      </div>
      {#if context.unlocked}
        <div class="list-controls">
          <button
            aria-label="Edit Subclass"
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
            aria-label="Subclass Context Menu"
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
      <div class="list-values add-trait-container">
        <button
          aria-label="Add Subclass"
          type="button"
          class="button button-secondary"
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
          aria-label="Browse for Subclass"
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
