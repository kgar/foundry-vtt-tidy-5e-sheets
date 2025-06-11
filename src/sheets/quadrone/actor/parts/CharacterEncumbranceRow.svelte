<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import ActorEncumbranceBar from './ActorEncumbranceBar.svelte';
  import type { CharacterSheetQuadroneContext } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let context = $derived(getSheetContext<CharacterSheetQuadroneContext>());

  const localize = FoundryAdapter.localize;
</script>

<div class="encumbrance-details pills flexrow">
  <div class="pill flexshrink">
    <span class="text-normal">
      {localize('DND5E.AbilityStr')}
    </span>
    <span>{context.system.abilities.str.value}</span>
  </div>
  <div class="pill flexshrink">
    <span class="text-normal">
      {localize('DND5E.Size')}
    </span>
    <span>{context.size.label}</span>
  </div>
  <div class="pill flexshrink">
    <span class="text-normal">
      {localize('DND5E.Multiplier')}
    </span>
    <span>
      <span class="sign font-default-medium color-text-lighter">&times;</span>
      <span class="value font-data-medium color-text-default"
        >{context.size.mod}</span
      >
    </span>
  </div>

  <ActorEncumbranceBar />
</div>
