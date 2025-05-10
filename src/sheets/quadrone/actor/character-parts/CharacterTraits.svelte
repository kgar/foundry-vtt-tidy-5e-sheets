<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import LevelUpDropdown from 'src/sheets/classic/actor/LevelUpDropdown.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

<fieldset class="character-traits">
  <legend>
    {localize('TIDY5E.CharacterTraits.Title')}

    {#if context.unlocked}
      <button
        type="button"
        class="button"
        onclick={() => alert('TODO: Make Special Traits App')}
      >
        <i class="fa-solid fa-star"></i>
        {localize('DND5E.SpecialTraits')}
      </button>
    {/if}
  </legend>

  <!-- Classes -->
  <div class="form-group">
    <label>
      {localize('TYPES.Item.class')}
    </label>

    <div class="form-fields trait-cards">
      {#each context.classes as cls (cls.uuid)}
        <div class="trait class">
          <img src={cls.img} alt={cls.name} class="item-image flex0" />
          <button
            class="button button-borderless"
            onclick={(ev) =>
              cls.item.sheet.render({
                force: true,
                mode: context.unlocked
                  ? CONSTANTS.SHEET_MODE_EDIT
                  : CONSTANTS.SHEET_MODE_PLAY,
              })}
          >
            {localize(cls.name)}
          </button>
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
            <span>
              {@html localize('DND5E.LevelNumber', {
                level: `<span class="font-weight-label">${cls.levels}</span>`,
              })}
            </span>
          {/if}
          <div><em>TODO: Handle Present and Missing Subclass; also handle right-click context menu for Class and Subclass</em></div>
        </div>
      {/each}
      {#if context.unlocked}
        <button
          type="button"
          class="add-item-card-button"
          onclick={(ev) =>
            FoundryAdapter.showClassCompendiumBrowser(context.actor)}
        >
          {localize('DND5E.ClassAdd')}
        </button>
      {/if}
    </div>
  </div>

  <!-- Species -->
  <div class="form-group">
    <label>
      {localize('TYPES.Item.race')}
    </label>
    <div class="form-fields"></div>
  </div>
  <!-- Background -->
  <!-- Size -->
  <!-- Speed -->
  <!-- Senses -->
  <!-- Resistances -->
  <!-- Damage Modification -->
  <!-- Armor -->
  <!-- Weapons -->
  <!-- Languages -->
</fieldset>
