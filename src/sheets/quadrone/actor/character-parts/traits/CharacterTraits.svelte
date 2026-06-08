<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ActorTraitClasses from '../../parts/ActorTraitClasses.svelte';
  import CharacterTraitSpecies from './CharacterTraitSpecies.svelte';
  import ActorTraitBackground from '../../parts/ActorTraitBackground.svelte';
  import { CONSTANTS } from 'src/constants';
  import CharacterTraitPills from './CharacterTraitPills.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

<section class="character-traits">
  <div class="flexrow space-between character-traits-header">
    <div class="character-traits-title">
      <h3 class="font-title-small">
        {localize('TIDY5E.CharacterTraits.Title')}
      </h3>
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </div>
    {#if context.editable}
      <button
        type="button"
        class="button"
        onclick={async () => {
          const { TidySheetSettingsQuadroneApplication } = await import('src/applications/settings/sheet/TidySheetSettingsQuadroneApplication.svelte');
          context.sheet._renderChild(
            new TidySheetSettingsQuadroneApplication({
              document: context.actor,
              initialTabId: `sheet:${CONSTANTS.TAB_CHARACTER_ATTRIBUTES}`,
            }),
          );
        }}
      >
        <i class="fa-solid fa-star"></i>
        {localize('DND5E.SpecialTraits')}
      </button>
    {/if}
  </div>

  <div class="list traits">
    <ActorTraitClasses />

    <CharacterTraitSpecies />

    <ActorTraitBackground />

    <CharacterTraitPills configButtonLocation="end" />
  </div>
</section>
