<script lang="ts">
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import { mapRaritiesToSave } from 'src/utils/system-properties-quadrone';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);
</script>

{#if context.rarities}
  <div class="form-group stacked class-properties checkbox-grid">
    <label for="">{FoundryAdapter.localize('DND5E.Rarity')}</label>
    <div class="form-fields">
      {#each context.rarities.options as option}
        <label class="checkbox" for="{appId}-rarity-{option.value}">
          <CheckboxQuadrone
            id="{appId}-rarity-{option.value}"
            document={context.item}
            field="system.rarities.{option.value}"
            checked={option.selected}
            disabled={!context.unlocked}
            onDataPreparing={(ev) =>
              mapRaritiesToSave(context, ev, option.value)}
          />
          {option.label}
        </label>
      {/each}
    </div>
  </div>
{/if}
