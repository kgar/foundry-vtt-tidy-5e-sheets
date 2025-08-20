<script lang="ts">
    import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
    import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<div class="list-entry trait-size">
  <div class="list-label">
    <label for="{appId}-npc-size" class="h4 font-weight-label">
      <i class="fas fa-ruler-combined"></i>
      {localize('DND5E.Size')}
    </label>
  </div>
  <div class="list-content">
    <div class="list-values">
      {#if context.unlocked}
        <SelectQuadrone
          id="{appId}-npc-size"
          document={context.actor}
          field="system.traits.size"
          value={context.system.traits.size}
        >
          <SelectOptions data={context.config.actorSizes} labelProp="label" />
        </SelectQuadrone>
      {:else}
        <ul class="pills">
          <li class="pill pill-medium">
            {context.size.label}
          </li>
        </ul>
      {/if}
    </div>
  </div>
</div>
