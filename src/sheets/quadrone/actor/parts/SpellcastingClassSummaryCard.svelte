<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
    SpellcastingContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';

  // TODO: Further generalize this so it can be used by a classless NPC.

  interface Props {
    info: SpellcastingContext;
    multiclass: boolean;
    tabId: string;
  }

  let { info, multiclass, tabId }: Props = $props();

  let itemFilterService = getContext<ItemFilterService>(
    CONSTANTS.SVELTE_CONTEXT.ITEM_FILTER_SERVICE,
  );

  const localize = FoundryAdapter.localize;

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  function onPreparedClicked(): any {
    itemFilterService.onFilterClearAll(tabId);
    itemFilterService.onFilter(tabId, 'prepared', true);
    itemFilterService.onFilter(
      tabId,
      `source-class-${info.classIdentifier}`,
      true,
    );
  }
</script>

<div
  class={[
    'spellcasting card',
    {
      primary: info.primary,
      ['has-max']: info.prepared.max,
      multiclass,
    },
  ]}
  data-ability={info.ability.key}
>
  <div class="header">
    <span class="name">{info.name}</span>

    {#if info.primary}
      <i class="fa-solid fa-chess-queen"></i>
    {:else if context.unlocked}
      <a
        data-tooltip="DND5E.SpellAbilitySet"
        class="button button-borderless button-icon-only"
        onclick={() =>
          context.actor.update({
            'system.attributes.spellcasting': info.ability.key,
          })}
      >
        <i class="fa-regular fa-chess-queen"></i>
      </a>
    {/if}
  </div>
  <div class="info pills">
    <div class="spellcasting-ability pill">
      {info.ability.label}
    </div>
    <div class="ability pill">
      <span class="label">{localize('DND5E.Ability')}</span>
      <span class="value">
        <span class="sign">{info.ability.mod.sign}</span>
        <span>{info.ability.mod.value}</span>
      </span>
    </div>
    <div class="attack pill">
      <span class="label">{localize('DND5E.Attack')}</span>
      <span class="value">
        <span class="sign">{info.attack.mod.sign}</span>
        <span>{info.attack.mod.value}</span>
      </span>
    </div>
    <div class="save pill">
      <span class="label">{localize('DND5E.SpellDC')}</span>
      <span class="value">
        {info.save}
      </span>
    </div>
    <a class="prepared pill interactive" onclick={() => onPreparedClicked()}>
      <span class="label">{localize('DND5E.Prepared')}</span>
      <span class="value preparations">
        <span class="count">{info.prepared.value}</span>
        <span class="separator">/</span>
        <span class="max">{info.prepared.max}</span>
      </span>
    </a>
  </div>
</div>
