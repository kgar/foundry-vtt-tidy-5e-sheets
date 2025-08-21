<script lang="ts">
    import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
    import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';
  import ActorTraitPills from 'src/sheets/quadrone/actor/parts/ActorTraitPills.svelte';

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

{#if context.unlocked}
  <div class={['list-entry trait-size']}>
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class="fas fa-ruler-combined"></i>
        {localize('DND5E.Size')}
      </h4>
      {#if context.unlocked}
        <label 
          class="select-button button button-borderless button-icon-only button-config flexshrink" 
          for="{appId}-npc-size"
          aria-label={localize('DND5E.Size')}>
          <SelectQuadrone
            class="native-select-overlay"
            id="{appId}-npc-size"
            document={context.actor}
            field="system.traits.size"
            value={context.system.traits.size}
          >
            <SelectOptions data={context.config.actorSizes} labelProp="label" />
          </SelectQuadrone>
          <i class="fa-solid fa-cog" aria-hidden="true"></i>
        </label>
      {/if}
    </div>
    <div class="list-content">
      <div class="list-values">
        {#if context.system.traits.size && context.config.actorSizes[context.system.traits.size]}
          <ActorTraitPills
            values={[
              {
                key: 'size',
                label: context.config.actorSizes[context.system.traits.size].label,
              },
            ]}
          />
        {/if}
      </div>
    </div>
  </div>
{/if}
