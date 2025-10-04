<script lang="ts">
  import { SpecialTraitsApplication } from 'src/applications-quadrone/special-traits/SpecialTraitsApplication.svelte';
  import CharacterTraitPills from '../character-parts/traits/CharacterTraitPills.svelte';
  import ActorTraitConfigurableListEntry from '../parts/ActorTraitConfigurableListEntry.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

<div class="list traits">
  <CharacterTraitPills configButtonLocation="label">
    {#snippet preCustomTraits()}
      <!-- Special Traits -->
      <ActorTraitConfigurableListEntry
        configButtonLocation="label"
        label={localize('DND5E.SpecialTraits')}
        entries={context.specialTraits}
        configurationTooltip={localize('DND5E.SpecialTraits')}
        onconfig={() =>
          new SpecialTraitsApplication({ document: context.actor }).render({
            force: true,
          })}
        icon="fa-solid fa-star"
      />
    {/snippet}
  </CharacterTraitPills>
</div>
