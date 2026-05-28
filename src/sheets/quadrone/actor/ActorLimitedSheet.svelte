<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import ActorPortrait from './parts/ActorPortrait.svelte';
  import type {
    CharacterSheetQuadroneContext,
    EncounterSheetQuadroneContext,
    GroupSheetQuadroneContext,
    NpcSheetQuadroneContext,
    VehicleSheetQuadroneContext,
  } from 'src/types/types';
  import { coalesce } from 'src/utils/formatting';

  let context =
    $derived(
      getSheetContext<
        | CharacterSheetQuadroneContext
        | NpcSheetQuadroneContext
        | VehicleSheetQuadroneContext
        | EncounterSheetQuadroneContext
        | GroupSheetQuadroneContext
      >(),
    );

  const localize = FoundryAdapter.localize;

  const biography = $derived(
    context.type === CONSTANTS.SHEET_TYPE_NPC
      ? coalesce(context.enriched.publicBiography, '&nbsp;')
      : context.type === CONSTANTS.SHEET_TYPE_CHARACTER ||
          context.type === CONSTANTS.SHEET_TYPE_VEHICLE
        ? coalesce(context.enriched.biography, '&nbsp;')
        : null,
  );

  const description = $derived(
    context.type == CONSTANTS.SHEET_TYPE_GROUP ||
      context.type === CONSTANTS.SHEET_TYPE_ENCOUNTER
      ? coalesce(context.enriched.description.full, '&nbsp;')
      : null,
  );
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
  {#if description}
    <div class="editor-rendered-content">
      <h3>
        {localize('DND5E.Description')}
      </h3>
      <tidy-gold-header-underline></tidy-gold-header-underline>
      {@html description}
    </div>
  {/if}
  {#if biography}
    <div class="editor-rendered-content">
      <h3>
        {localize('DND5E.Biography')}
      </h3>
      <tidy-gold-header-underline></tidy-gold-header-underline>
      {@html biography}
    </div>
  {/if}
  {#if context.type === CONSTANTS.SHEET_TYPE_NPC && context.enriched.appearance}
    <div class="editor-rendered-content">
      <h3>
        {localize('DND5E.Appearance')}
      </h3>
      <tidy-gold-header-underline></tidy-gold-header-underline>
      {@html context.enriched.appearance}
    </div>
  {/if}
</div>
