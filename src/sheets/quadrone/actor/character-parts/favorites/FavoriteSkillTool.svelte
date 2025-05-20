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
</script>

<li class="favorite" data-reference-tooltip={favorite.reference}>
  <img src={favorite.img} alt={favorite.name} class="item-image" />
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
