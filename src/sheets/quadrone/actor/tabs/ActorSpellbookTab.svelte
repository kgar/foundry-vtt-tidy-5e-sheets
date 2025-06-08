<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import ActorActionBar from '../parts/ActorActionBar.svelte';
  import SpellTables from '../../shared/SpellTables.svelte';

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let searchCriteria = $state('');

  let spellbook = $derived(
    SheetSections.configureSpellbook(context.actor, tabId, context.spellbook),
  );
</script>

<ActorActionBar bind:searchCriteria sections={spellbook} {tabId} />

<SpellTables
  sections={spellbook}
  editable={context.editable}
  itemContext={context.itemContext}
  {inlineToggleService}
  sheetDocument={context.actor}
  unlocked={context.unlocked}
/>
