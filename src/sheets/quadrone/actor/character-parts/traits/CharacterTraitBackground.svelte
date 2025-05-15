<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

<div
  class="list-entry"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-item-id={context.system.details.background?.id}
>
  <div class="list-label">
    <h4>
      {localize('TYPES.Item.background')}
    </h4>
  </div>
  <div class="list-values">
    {#if context.actor.system.details.background}
      {@const bg = context.actor.system.details.background}

      <img src={bg.img} alt={bg.name} class="item-image flex0" />
      <button
        type="button"
        class="button button-borderless"
        onclick={() =>
          bg.sheet.render({
            force: true,
            mode: context.unlocked
              ? CONSTANTS.SHEET_MODE_EDIT
              : CONSTANTS.SHEET_MODE_PLAY,
          })}
      >
        <span class="font-weight-label">
          {bg.name}
        </span>
      </button>
      <span class="font-weight-default color-text-lighter">
        {context.creatureType.title}
      </span>
      {#if context.creatureType.subtitle}
        <span class="font-weight-default color-text-lighter">
          {context.creatureType.subtitle}
        </span>
      {/if}
    {:else if context.unlocked}
      <div class="list-values">
        <button
          type="button"
          class="button button-borderless"
          data-tooltip="DND5E.BackgroundAdd"
          onclick={(ev) =>
            FoundryAdapter.createItem({ type: 'background' }, context.actor)}
        >
          {localize('DND5E.BackgroundAdd')}
        </button>
        <button
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
      </div>
    {/if}
  </div>
</div>
