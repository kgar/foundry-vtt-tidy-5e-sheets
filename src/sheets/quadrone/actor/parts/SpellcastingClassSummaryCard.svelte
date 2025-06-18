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
    'spellcasting-class-card flexrow',
    {
      primary: info.primary,
      ['has-max']: info.prepared.max,
      multiclass,
    },
  ]}
  data-ability={info.ability.key}
>
  <div class="header flexshrink">
    <span class="name font-title-small">{info.name}</span>

    {#if info.primary}
      <i class="fa-solid fa-crown primary-icon"></i>
    {:else if context.unlocked}
      <a
        data-tooltip="DND5E.SpellAbilitySet"
        class="button button-borderless button-icon-only"
        onclick={() =>
          context.actor.update({
            'system.attributes.spellcasting': info.ability.key,
          })}
      >
        <i class="fa-regular fa-crown primary-icon"></i>
      </a>
    {/if}
  </div>
  <div class="info pills flex1">
    <div class="spellcasting-ability pill">
      {info.ability.label}
    </div>
    <div class="ability pill">
      <span class="label font-label-medium text-color-lighter">{localize('DND5E.Ability')}</span>
      <span class="value">
        <span class="sign font-label-medium text-color-lightest">{info.ability.mod.sign}</span>
        <span class="font-data-medium">{info.ability.mod.value}</span>
      </span>
    </div>
    <div class="attack pill">
      <span class="label font-label-medium text-color-lighter">{localize('DND5E.Attack')}</span>
      <span class="value">
        <span class="sign font-label-medium text-color-lightest">{info.attack.mod.sign}</span>
        <span class="font-data-medium">{info.attack.mod.value}</span>
      </span>
    </div>
    <div class="save pill">
      <span class="label font-label-medium text-color-lighter">{localize('DND5E.SpellDC')}</span>
      <span class="value">
        <span class="font-data-medium">{info.save}</span>
      </span>
    </div>
    <a class="prepared pill interactive" onclick={() => onPreparedClicked()}>
      <span class="label font-label-medium text-color-lighter">{localize('DND5E.Prepared')}</span>
      <span class="value preparations">
        <span class="count">{info.prepared.value}</span>
        <span class="separator">/</span>
        <span class="max">{info.prepared.max}</span>
      </span>
    </a>
  </div>
</div>
