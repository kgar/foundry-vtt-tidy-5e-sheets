<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import { isNil } from 'src/utils/data';

  let context = $derived(getItemSheetContextQuadrone());
  
  const localize = FoundryAdapter.localize;
</script>

{#if !isNil(context.item.system.spellcasting?.progression, '', 'none')}
  <li>
    <span class="pill centered wrapped">
      <span class="text-normal">
        {localize('DND5E.SpellProgression')}
      </span>
      <span class="hyphens-auto">
        {CONFIG.DND5E.spellProgression[
          context.item.system.spellcasting.progression
        ]?.label ?? context.item.system.spellcasting.progression}
      </span>
    </span>
  </li>
{/if}
{#if !isNil(context.system.spellcasting?.ability, '')}
  <li>
    <span class="pill centered wrapped">
      <span class="text-normal">
        {localize('DND5E.SpellAbility')}
      </span>
      <span class="hyphens-auto">
        {CONFIG.DND5E.abilities[context.item.system.spellcasting.ability]
          ?.label ?? context.item.system.spellcasting.ability}
      </span>
    </span>
  </li>
{/if}
