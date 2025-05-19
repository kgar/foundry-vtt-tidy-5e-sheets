<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

{#if context.unlocked || context.actor.system.details.background}
<div
  class="list-entry"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-item-id={context.system.details.background?.id}
>
  <div class="list-label">
    <h4 class="font-weight-label">
      {localize('TYPES.Item.background')}
    </h4>
  </div>
  <div class="list-content">
    <div class="list-values trait-item">
      {#if context.actor.system.details.background}
        {@const bg = context.actor.system.details.background}
        <a
          aria-label="View {localize('TYPES.Item.subclass')}"
          class="item-image-link"
          role="button"
          onclick={() => bg.sheet.render({
            force: true,
            mode: CONSTANTS.SHEET_MODE_PLAY,
          })}
          onkeydown={(e) => e.key === 'Enter' && bg.sheet.render({
            force: true,
            mode: CONSTANTS.SHEET_MODE_PLAY,
          })}
        >
          <img src={bg.img} alt={bg.name} class="item-image flex0" />
        </a>
        <span class="font-weight-label">
          {bg.name}
        </span>
      {:else if context.unlocked}
        <button
          aria-label="Add {localize('TYPES.Item.background')}"
          type="button"
          class="button button-primary"
          data-tooltip="DND5E.BackgroundAdd"
          onclick={(ev) =>
            FoundryAdapter.createItem({ type: 'background' }, context.actor)}
        >
          {localize('DND5E.BackgroundAdd')}
        </button>
        <button
          aria-label="Browse for {localize('TYPES.Item.background')}"
          type="button"
          class="button button-borderless button-icon-only"
          data-tooltip="DND5E.BackgroundAdd"
          onclick={(ev) =>
            context.actor.sheet.findItem({
              event: ev,
              type: 'background',
            })}
        >
          <i class="fa-solid fa-book-open-reader"></i>
        </button>
      {/if}
    </div>
    {#if context.unlocked && context.actor.system.details.background}
    <div class="list-controls">
      <button
        aria-label="Edit {localize('DND5E.CreatureType')}"
        type="button"
        class="button button-borderless button-icon-only"
        data-tooltip="DND5E.ItemEdit"
        onclick={() =>
            context.actor.sheet.render({
              force: true,
              mode: context.unlocked
                ? CONSTANTS.SHEET_MODE_EDIT
                : CONSTANTS.SHEET_MODE_PLAY,
            })}
      >
        <i class="fa-solid fa-edit"></i>
      </button>
    </div>
    {/if}
  </div>
</div>
{/if}
