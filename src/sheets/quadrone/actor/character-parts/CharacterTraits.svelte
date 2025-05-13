<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import LevelUpDropdown from 'src/sheets/classic/actor/LevelUpDropdown.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ActorTraitPills from '../parts/ActorTraitPills.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

<section class="character-traits">
  <div class="flexrow space-between">
    <h3 class="font-title-small">
      {localize('TIDY5E.CharacterTraits.Title')}
    </h3>
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
  </div>
  <tidy-gold-header-underline></tidy-gold-header-underline>

  <!-- Classes -->
  <div class="pills-group">
    <h4>
      {localize('TYPES.Item.class')}
    </h4>

    <div class="pills-lg">
      {#each context.classes as cls (cls.uuid)}
        <div class="pill-lg">
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
          class="pill-lg empty"
          onclick={(ev) =>
            FoundryAdapter.showClassCompendiumBrowser(context.actor)}
        >
          {localize('DND5E.ClassAdd')}
        </button>
      {/if}
    </div>
  </div>

  <!-- Species -->
  <div class="pills-group">
    <h4>
      {localize('TYPES.Item.race')}
    </h4>
    <div class="pills-lg">
      {#if context.actor.system.details.race}
        {@const species = context.actor.system.details.race}
        <div class="pill-lg">
          <img src={species.img} alt={species.name} class="item-image flex0" />
          <button
            class="button button-borderless"
            onclick={(ev) =>
              species.sheet.render({
                force: true,
                mode: context.unlocked
                  ? CONSTANTS.SHEET_MODE_EDIT
                  : CONSTANTS.SHEET_MODE_PLAY,
              })}
          >
            <span class="font-weight-label">
              {species.name}
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
        </div>
      {:else}
        <button
          class="pill-lg empty"
          onclick={(ev) =>
            FoundryAdapter.showSpeciesCompendiumBrowser(context.actor)}
        >
          {localize('DND5E.Species.Add')}
        </button>
      {/if}
    </div>
  </div>
  <!-- Background -->
  <div class="pills-group">
    <h4>
      {localize('TYPES.Item.background')}
    </h4>
    <div class="pills-lg">
      {#if context.actor.system.details.background}
        {@const bg = context.actor.system.details.background}
        <div class="pill-lg">
          <div class="pill-lg">
            <img src={bg.img} alt={bg.name} class="item-image flex0" />
            <button
              class="button button-borderless"
              onclick={(ev) =>
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
          </div>
        </div>
      {:else}
        <button
          class="pill-lg empty"
          onclick={(ev) =>
            FoundryAdapter.showBackgroundCompendiumBrowser(context.actor)}
        >
          {localize('DND5E.BackgroundAdd')}
        </button>
      {/if}
    </div>
  </div>
  <!-- Size -->
  <div class="pills-group">
    <h4>
      {localize('DND5E.Size')}
    </h4>
    <ul class="pills">
      <li class="pill">
        {#if context.unlocked}
          <SelectQuadrone
            document={context.actor}
            field="system.traits.size"
            value={context.system.traits.size}
          >
            <SelectOptions data={context.config.actorSizes} labelProp="label" />
          </SelectQuadrone>
        {:else}
          {context.size.label}
        {/if}
      </li>
    </ul>
  </div>

  <!-- TODO: Continue here -->
  <!-- Speed -->
  <div class="pills-group">
    <div class="flexrow space-between">
      <h4>
        {localize('DND5E.Speed')}
      </h4>
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
    </div>
    <ul class="pills"></ul>
  </div>
  <!-- Senses -->
  <div class="pills-group">
    <div class="flexrow space-between">
      <h4>
        {localize('DND5E.Senses')}
      </h4>
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
    </div>
    <ul class="pills"></ul>
  </div>
  <!-- Resistances -->
  <div class="pills-group">
    <div class="flexrow space-between">
      <h4>
        {localize('DND5E.Resistances')}
      </h4>
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
    </div>
    <ul class="pills"></ul>
  </div>
  <!-- Damage Immunities -->
  <div class="pills-group">
    <div class="flexrow space-between">
      <h4>
        {localize('DND5E.TraitDIPlural.other')}
      </h4>
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
    </div>
    <ul class="pills"></ul>
  </div>
  <!-- Condition Immunities -->
  <div class="pills-group">
    <div class="flexrow space-between">
      <h4>
        {localize('DND5E.TraitCIPlural.other')}
      </h4>
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
    </div>
    <ul class="pills"></ul>
  </div>
  <!-- Vulnerabilities -->
  <div class="pills-group">
    <div class="flexrow space-between">
      <h4>
        {localize('DND5E.Vulnerabilities')}
      </h4>
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
    </div>
    <ul class="pills"></ul>
  </div>
  <!-- Damage Modification -->
  <div class="pills-group">
    <div class="flexrow space-between">
      <h4>
        {localize('DND5E.DamageModification.Label')}
      </h4>
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
    </div>
    <ul class="pills"></ul>
  </div>
  <!-- Armor -->
  <div class="pills-group">
    <div class="flexrow space-between">
      <h4>
        {localize('DND5E.Armor')}
      </h4>
      {#if context.unlocked}
        <button
          type="button"
          class="button button-borderless icon-only config-button"
          onclick={(ev) => FoundryAdapter.renderArmorConfig(context.actor)}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </div>
    <ul class="pills"></ul>
  </div>
  <!-- Weapons -->
  <div class="pills-group">
    <div class="flexrow space-between">
      <h4>
        {localize('TYPES.Item.weaponPl')}
      </h4>
      {#if context.unlocked}
        <button
          type="button"
          class="button button-borderless icon-only config-button"
          onclick={(ev) => FoundryAdapter.renderWeaponsConfig(context.actor)}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </div>
    <ul class="pills"></ul>
  </div>
  <!-- Languages -->
  <div class="pills-group">
    <div class="flexrow space-between">
      <h4>
        {localize('DND5E.Languages')}
      </h4>
      {#if context.unlocked}
        <button
          type="button"
          class="button button-borderless icon-only config-button"
          onclick={(ev) => FoundryAdapter.renderLanguagesConfig(context.actor)}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </div>
    <ul class="pills"></ul>
  </div>
</section>
