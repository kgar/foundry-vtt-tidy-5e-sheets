<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

<div class="list-entry">
  <div class="list-label">
    <h4>
      {localize('TYPES.Item.background')}
    </h4>
    {#if context.unlocked && !context.actor.system.details.background}
      <button
        type="button"
        class="button button-borderless button-icon-only"
        data-tooltip="DND5E.BackgroundAdd"
        onclick={() =>
          FoundryAdapter.showBackgroundCompendiumBrowser(context.actor)}
      >
        <i class="fa-solid fa-plus"></i>
      </button>
    {/if}
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
    {/if}
  </div>
</div>
