<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import ActorPortrait from './parts/ActorPortrait.svelte';
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

  const localize = FoundryAdapter.localize;
</script>

<header class="sheet-header limited-sheet flexcol theme-dark">
  <div class="sheet-header-content flexrow">
    <h1 class="actor-name flex1">{context.actor.name}</h1>
    <div class="actor-vitals-container">
      <ActorPortrait />
    </div>
  </div>
</header>
<div class="sheet-body limited-sheet scroll-container">
  <div class="editor-rendered-content">
    <h3>
      {localize('DND5E.Biography')}
    </h3>
    <tidy-gold-header-underline></tidy-gold-header-underline>
    {#if context.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER}
      {@html context.enriched.biography}
    {:else}
      {@html context.enriched.publicBiography}
    {/if}
  </div>
</div>
