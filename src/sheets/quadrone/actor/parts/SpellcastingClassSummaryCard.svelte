<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSourceClassFilterName } from 'src/runtime/item/default-item-filters';
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
    itemFilterService.onFilter(tabId, CONSTANTS.FILTER_PREPARED, true);
    itemFilterService.onFilter(
      tabId,
      getSourceClassFilterName(info.classIdentifier),
      true,
    );
  }

  let expanded = true;
</script>

{#if expanded}
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
        <i
          data-tooltip="DND5E.SpellAbility"
          class="fa-solid fa-chess-queen primary-icon color-text-gold-emphasis"
        >
        </i>
      {:else if context.unlocked}
        <a
          data-tooltip="DND5E.SpellAbilitySet"
          class="button button-borderless button-icon-only"
          onclick={() =>
            context.actor.update({
              'system.attributes.spellcasting': info.ability.key,
            })}
        >
          <i
            class="fa-regular fa-chess-queen primary-icon color-text-gold-emphasis"
          ></i>
        </a>
      {/if}
    </div>
    <div class="info pills flex1">
      <div class="spellcasting-ability pill pill-medium">
        {info.ability.label}
      </div>
      <div class="ability pill pill-medium">
        <span class="label font-label-medium color-text-lighter"
          >{localize('DND5E.Ability')}</span
        >
        <span class="value">
          <span class="sign font-label-medium color-text-lightest"
            >{info.ability.mod.sign}</span
          ><span class="font-data-medium">{info.ability.mod.value}</span>
        </span>
      </div>
      <div class="attack pill pill-medium">
        <span class="label font-label-medium color-text-lighter"
          >{localize('DND5E.Attack')}</span
        >
        <span class="value">
          <span class="sign font-label-medium color-text-lightest"
            >{info.attack.mod.sign}</span
          ><span class="font-data-medium">{info.attack.mod.value}</span>
        </span>
      </div>
      <div class="save pill pill-medium">
        <span class="label font-label-medium color-text-lighter"
          >{localize('DND5E.SpellDC')}</span
        >
        <span class="value">
          <span class="font-data-medium">{info.save}</span>
        </span>
      </div>
      <a
        class="prepared pill pill-medium interactive"
        onclick={() => onPreparedClicked()}
      >
        <span class="label font-label-medium color-text-lighter"
          >{localize('DND5E.Prepared')}</span
        >
        <span class="value preparations">
          <span class="count font-data-medium">{info.prepared.value}</span><span
            class="separator font-default-medium color-text-gold">/</span
          ><span class="max font-label-medium color-text-lighter"
            >{info.prepared.max}</span
          >
        </span>
      </a>
    </div>
  </div>
{:else}
<div
class={[
  'spellcasting-class-card compact flexrow',
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
    <i
      data-tooltip="DND5E.SpellAbility"
      class="fa-solid fa-chess-queen primary-icon color-text-gold-emphasis"
    >
    </i>
  {:else if context.unlocked}
    <a
      data-tooltip="DND5E.SpellAbilitySet"
      class="button button-borderless button-icon-only"
      onclick={() =>
        context.actor.update({
          'system.attributes.spellcasting': info.ability.key,
        })}
    >
      <i
        class="fa-regular fa-chess-queen primary-icon color-text-gold-emphasis"
      ></i>
    </a>
  {/if}
</div>
<div class="info pills flex1">
  <div class="ability" data-tooltip={localize('DND5E.Ability') + ': ' + info.ability.label}>
    <span class="label font-label-medium color-text-gold uppercase"
      >{info.ability.key}</span>
    <span class="value">
      <span class="sign font-label-medium color-text-lightest"
        >{info.ability.mod.sign}</span
      ><span class="font-data-medium">{info.ability.mod.value}</span>
    </span>
  </div>
  <div class="divider-dot"></div>
  <div class="attack">
    <span class="label font-label-medium color-text-lighter"
      >{localize('DND5E.Attack')}</span
    >
    <span class="value">
      <span class="sign font-label-medium color-text-lightest"
        >{info.attack.mod.sign}</span
      ><span class="font-data-medium">{info.attack.mod.value}</span>
    </span>
  </div>
  <div class="divider-dot"></div>
  <div class="save" data-tooltip={localize('DND5E.SpellDC')}>
    <span class="label font-label-medium color-text-lighter"
      >{localize('DND5E.AbbreviationDC')}</span
    >
    <span class="value">
      <span class="font-data-medium">{info.save}</span>
    </span>
  </div>
  <button
    class="prepared pill pill-medium interactive"
    data-tooltip={localize('DND5E.Prepared')}
    aria-label={localize('DND5E.Prepared')}
    onclick={() => onPreparedClicked()}
  >
    <i class="fa-solid fa-book"></i>
    <span class="value preparations">
      <span class="count font-data-medium">{info.prepared.value}</span><span
        class="separator font-default-medium color-text-gold">/</span
      ><span class="max font-label-medium color-text-lighter"
        >{info.prepared.max}</span
      >
    </span>
  </button>
</div>
</div>
{/if}
