<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
    SpellcastingContext,
  } from 'src/types/types';
  import { isNil } from 'src/utils/data';

  interface Props {
    info: SpellcastingContext;
    multiclass: boolean;
  }

  let { info, multiclass }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );
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
    <span class="class-name">{info.className}</span>
    {#if !isNil(info.subclassName)}
      <span class="subclass-name">{info.subclassName}</span>
    {/if}

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
  <div class="info">
    <div class="ability">
      <span class="label">{localize('DND5E.Ability')}</span>
      <span class="value">
        <span class="sign">{info.ability.mod.sign}</span>
        <span>{info.ability.mod.value}</span>
      </span>
    </div>
    <div class="attack">
      <span class="label">{localize('DND5E.Attack')}</span>
      <span class="value">
        <span class="sign">{info.attack.mod.sign}</span>
        <span>{info.attack.mod.value}</span>
      </span>
    </div>
    <div class="save">
      <span class="label">{localize('DND5E.SpellDC')}</span>
      <span class="value">
        {info.save}
      </span>
    </div>
    <div class="prepared">
      <span class="label">{localize('DND5E.Prepared')}</span>
      <span class="value preparations">
        <span class="count">{info.prepared.value}</span>
        <span class="separator">/</span>
        <span class="max">{info.prepared.max}</span>
      </span>
    </div>
  </div>
</div>
