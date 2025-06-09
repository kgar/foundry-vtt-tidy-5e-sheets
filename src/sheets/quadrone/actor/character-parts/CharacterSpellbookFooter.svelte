<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { CharacterSheetQuadroneContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';
  import { isNil } from 'src/utils/data';

  interface Props {
    class?: ClassValue;
  }

  let { class: classValue }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context = $derived(getSheetContext<CharacterSheetQuadroneContext>());

  function onAddClicked() {
    context.actor.sheet._addDocument({
      tabId: CONSTANTS.TAB_ACTOR_SPELLBOOK,
    });
  }

  let multiclass = $derived(context.spellcasting.length > 1);
</script>

<div class={['sheet-footer', classValue]}>
  {#each context.spellcasting as info}
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
  {/each}

  <a
    data-tooltip="DND5E.ItemCreate"
    class="button button-icon-only button-primary item-create"
    class:disabled={!context.editable}
    onclick={onAddClicked}
  >
    <i class="fas fa-plus"></i>
  </a>
</div>
