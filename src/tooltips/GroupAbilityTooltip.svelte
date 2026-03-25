<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { tick } from 'svelte';
  import { Tooltip } from './Tooltip';
  import { getThemeV2 } from 'src/theme/theme';
  import { getModifierData } from 'src/utils/formatting';
  import type { Actor5e } from 'src/types/types';
  import type { PortraitShape } from 'src/theme/theme-quadrone.types';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';

  const localize = FoundryAdapter.localize;

  interface Props {
    sheetDocument: any;
  }

  let { sheetDocument }: Props = $props();

  let tooltip: HTMLElement;

  type GroupAbility = {
    key: string;
    label: string;
    members: {
      actor: Actor5e;
      portrait?: { shape: PortraitShape };
      highlightColor?: string;
    }[];
  };

  let ability: GroupAbility = $state({
    key: '',
    label: '',
    members: [],
  });

  let highestScore = $derived(
    ability.members.reduce(
      (prev, curr) =>
        Math.max(prev, curr.actor.system.abilities?.[ability.key]?.mod),
      0,
    ),
  );

  $inspect(ability);

  export async function tryShow(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
    hoveredAbility: GroupAbility,
  ): Promise<any> {
    if (!hoveredAbility.members.length) {
      return;
    }

    ability = hoveredAbility;

    const target = event?.currentTarget;

    await tick();

    Tooltip.show(target, tooltip.outerHTML, getThemeV2(sheetDocument));
  }
</script>

<div class="hidden">
  <div bind:this={tooltip} class="document-list-summary-tooltip">
    <h3 class="font-title-medium color-text-default">{ability.label}</h3>
    <hr />
    <ul class="group-ability-grid">
      <li class="group-tooltip-header">
        <div class=""></div>
        <div class=""></div>
        <div class="text-align-right font-label-small color-text-lightest">
          {localize('DND5E.AbilityModifierShort')}
        </div>
        <div class="text-align-right font-label-small color-text-lightest">
          <!-- (Score) -->
        </div>
        <div class="text-align-right font-label-small color-text-lightest">
          {localize('DND5E.SavingThrowShort')}
        </div>
        <div class="text-align-right font-label-small color-text-lightest">
          {localize('TIDY5E.AbbrProficiency')}
        </div>
      </li>
      {#each ability.members as member}
        {@const modScore = member.actor.system.abilities?.[ability.key]?.mod}
        {@const mod = getModifierData(modScore)}
        {@const saveScore =
          member.actor.system.abilities?.[ability.key]?.save.value}
        {@const save = getModifierData(saveScore)}

        <li>
          <div
            class={[
              'item-image',
              member.portrait?.shape ?? ThemeQuadrone.DEFAULT_PORTRAIT_SHAPE,
            ]}
            style="background-image: url('{member.actor.img}')"
          ></div>
          <div class="item-name truncate">{member.actor.name}</div>
          <div class="text-align-right">
            {#if modScore === highestScore}
              <i
                class="fa-solid fa-award color-text-gold-emphasis highlighted"
                style:color={member.highlightColor}
              ></i>
            {/if}
            <span class="font-body-medium color-text-lighter">{mod.sign}</span>
            <span class="font-label-medium color-text-default">{mod.value}</span
            >
          </div>
          <div class="text-align-right">
            <span class="font-label-medium color-text-lightest" style="margin-left: 6px;"
              >({member.actor.system.abilities[ability.key]?.value})</span
            >
          </div>
          <div class="text-align-right">
            <span class="font-body-medium color-text-lighter">{save.sign}</span>
            <span class="font-label-medium color-text-default"
              >{save.value}</span
            >
          </div>
          <div class="proficiency-pip-container">
            <i
              class="{FoundryAdapter.getProficiencyIconClass(
                member.actor.system.abilities[ability.key]?.proficient,
              )} fa-fw"
            ></i>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
