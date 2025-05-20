<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { SkillToolFavoriteContextEntry } from 'src/types/types';
  import { getModifierData } from 'src/utils/formatting';

  interface Props {
    favorite: SkillToolFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let localize = FoundryAdapter.localize;

  let data = $derived(context.actor.system[`${favorite.type}s`]?.[favorite.id]);

  let modifier = $derived(getModifierData(data.total));

  let subtitle = $derived(
    localize('DND5E.AbilityPromptTitle', {
      ability: CONFIG.DND5E.abilities[data.ability].label,
    }),
  );

  async function handleClick(
    event: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
  ) {
    if (favorite.type === 'skill') {
      await context.actor.rollSkill({ skill: favorite.key, event });
      return;
    }

    await context.actor.rollToolCheck({ tool: favorite.key, event });
  }
</script>

<li class="favorite" data-reference-tooltip={favorite.reference}>
  {#if context.editable}
    <a class="item-use-button" onclick={handleClick}>
      <img src={favorite.img} alt={favorite.name} class="item-image" />
      <span class="roll-prompt">
        <i class="fa fa-dice-d20"></i>
      </span>
    </a>
  {:else}
    <img src={favorite.img} alt={favorite.name} class="item-image" />
  {/if}

  <div class="name stacked">
    <span class="title">
      {favorite.name}
    </span>
    <span class="subtitle">
      {subtitle}
    </span>
  </div>

  <div class="info">
    <span class="modifier">
      <span class="sign">
        {modifier.sign}
      </span>
      <span>
        {modifier.value}
      </span>
      {#if data.passive}
        <span class="passive">({data.passive})</span>
      {/if}
    </span>
  </div>
</li>
