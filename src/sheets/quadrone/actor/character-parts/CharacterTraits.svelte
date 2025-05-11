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
          <div>
            <em
              >TODO: Handle Present and Missing Subclass; also handle
              right-click context menu for Class and Subclass</em
            >
          </div>
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
  <div class="form-group">
    <label>
      {localize('TYPES.Item.background')}
    </label>
    <div class="form-fields">
      {#if context.actor.system.details.background}
        TODO: A single pill here
        <span class="pill"> </span>
      {:else}
        TODO: Add Background Compendium Button here
      {/if}
    </div>
  </div>
  <!-- Size -->
  <div class="form-group">
    <label>
      {localize('DND5E.Size')}
    </label>
    <div class="form-fields"></div>
  </div>
  <!-- Speed -->
  <div class="form-group">
    <label>
      {localize('DND5E.Speed')}
      {#if context.unlocked}
        <button
          type="button"
          class="button button-borderless icon-only config-button"
          onclick={(ev) =>
            FoundryAdapter.renderMovementSensesConfig(
              context.actor,
              'movement',
            )}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </label>
    <ul class="form-fields"></ul>
  </div>
  <!-- Senses -->
  <div class="form-group">
    <label>
      {localize('DND5E.Senses')}
      {#if context.unlocked}
        <button
          type="button"
          class="button button-borderless icon-only config-button"
          onclick={(ev) =>
            FoundryAdapter.renderMovementSensesConfig(context.actor, 'senses')}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </label>
    <ul class="form-fields"></ul>
  </div>
  <!-- Resistances -->
  <div class="form-group">
    <label>
      {localize('DND5E.Resistances')}
      {#if context.unlocked}
        <button
          type="button"
          class="button button-borderless icon-only config-button"
          onclick={(ev) =>
            FoundryAdapter.openDamagesConfig(context.actor, 'dr')}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </label>
    <ul class="form-fields"></ul>
  </div>
  <!-- Damage Immunities -->
  <div class="form-group">
    <label>
      {localize('DND5E.TraitDIPlural.other')}
      {#if context.unlocked}
        <button
          type="button"
          class="button button-borderless icon-only config-button"
          onclick={(ev) =>
            FoundryAdapter.openDamagesConfig(context.actor, 'di')}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </label>
    <ul class="form-fields"></ul>
  </div>
  <!-- Condition Immunities -->
  <div class="form-group">
    <label>
      {localize('DND5E.TraitCIPlural.other')}
      {#if context.unlocked}
        <button
          type="button"
          class="button button-borderless icon-only config-button"
          onclick={(ev) =>
            FoundryAdapter.renderTraitsConfig(context.actor, 'ci')}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </label>
    <ul class="form-fields"></ul>
  </div>
  <!-- Vulnerabilities -->
  <div class="form-group">
    <label>
      {localize('DND5E.Vulnerabilities')}
      {#if context.unlocked}
        <button
          type="button"
          class="button button-borderless icon-only config-button"
          onclick={(ev) =>
            FoundryAdapter.openDamagesConfig(context.actor, 'dv')}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </label>
    <ul class="form-fields"></ul>
  </div>
  <!-- Damage Modification -->
  <div class="form-group">
    <label>
      {localize('DND5E.DamageModification.Label')}
      {#if context.unlocked}
        <button
          type="button"
          class="button button-borderless icon-only config-button"
          onclick={(ev) =>
            FoundryAdapter.openDamagesConfig(context.actor, 'dm')}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </label>
    <ul class="form-fields"></ul>
  </div>
  <!-- Armor -->
  <div class="form-group">
    <label>
      {localize('DND5E.Armor')}
      {#if context.unlocked}
        <button
          type="button"
          class="button button-borderless icon-only config-button"
          onclick={(ev) => FoundryAdapter.renderArmorConfig(context.actor)}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </label>
    <ul class="form-fields"></ul>
  </div>
  <!-- Weapons -->
  <div class="form-group">
    <label>
      {localize('TYPES.Item.weaponPl')}
      {#if context.unlocked}
        <button
          type="button"
          class="button button-borderless icon-only config-button"
          onclick={(ev) => FoundryAdapter.renderWeaponsConfig(context.actor)}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </label>
    <ul class="form-fields"></ul>
  </div>
  <!-- Languages -->
  <div class="form-group">
    <label>
      {localize('DND5E.Languages')}
      {#if context.unlocked}
        <button
          type="button"
          class="button button-borderless icon-only config-button"
          onclick={(ev) => FoundryAdapter.renderLanguagesConfig(context.actor)}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </label>
    <ul class="form-fields"></ul>
  </div>
</fieldset>
