<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import CharacterPortrait from './character-parts/CharacterPortrait.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
    VehicleSheetQuadroneContext,
  } from 'src/types/types';

  let context =
    $derived(
      getSheetContext<
        | CharacterSheetQuadroneContext
        | NpcSheetQuadroneContext
        | VehicleSheetQuadroneContext
      >(),
    );

  let portraitShape = 'round';

  const localize = FoundryAdapter.localize;
</script>

<header class="sheet-header limited-sheet flexcol theme-dark">
  <div class="sheet-header-content flexrow">
    <h1 class="character-name flex1">{context.actor.name}</h1>
    <div class="character-vitals-container">
      <CharacterPortrait
        imageUrl={context.actor.img}
        imageAlt={context.actor.name}
        {portraitShape}
      />
    </div>
  </div>
</header>
<div class="sheet-body limited-sheet scroll-container">
  <div class="editor-rendered-content">
    <h3>
      {localize('DND5E.Biography')}
    </h3>
    <tidy-gold-header-underline></tidy-gold-header-underline>
    {@html context.enriched.biography}
  </div>
</div>
