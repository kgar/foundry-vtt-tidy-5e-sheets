<script lang="ts">
  import { TidyFlags } from 'src/api';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { GroupMemberQuadroneContext } from 'src/types/types';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import GroupAbilityTooltip from 'src/tooltips/GroupAbilityTooltip.svelte';

  let context = $derived(getGroupSheetQuadroneContext());

  let emphasizedActorRef = getContext<
    Ref<GroupMemberQuadroneContext | undefined>
  >(CONSTANTS.SVELTE_CONTEXT.EMPHASIZED_MEMBER_REF);

  let emphasizedMember = $derived(emphasizedActorRef.value);

  let showModAndPassiveValues = $derived(
    emphasizedMember &&
      !![...context.members.all.values()].find(
        (m) => m.actor.uuid === emphasizedMember?.actor.uuid,
      ),
  );

  let tooltip = $state<GroupAbilityTooltip | undefined>();

  const localize = FoundryAdapter.localize;
</script>

<GroupAbilityTooltip bind:this={tooltip} sheetDocument={context.document} />

<div class="abilities card">
  <div class="use-ability-header flexrow">
    <h3 class="font-label-medium">
      {localize('DND5E.Abilities')}
    </h3>
    <span class="modifier-label color-text-lightest font-default-medium">
      {#if showModAndPassiveValues}
        <span class="ability-measure-header">
          {localize('DND5E.AbilityModifierShort')}
        </span>
        <span class="ability-measure-header">
          {localize('DND5E.SavingThrowShort')}
        </span>
      {:else}
        <span class="ability-measure-header">
          {localize('TIDY5E.AggregateSkill.HighMeasure')}
        </span>
        <span class="ability-measure-header">
          {localize('TIDY5E.AggregateSkill.LowMeasure')}
        </span>
      {/if}
    </span>
  </div>
  <ul
    class="ability-list unlist use-ability-list"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ABILITIES_LIST}
  >
    {#each context.abilities as ability}
      {@const memberAbility = ability.identifiers.get(
        emphasizedMember?.actor.uuid ?? '',
      )}
      {@const memberProficient = (memberAbility?.proficient ?? 0) > 0}

      <li
        class={[
          'ability-list-item',
          {
            'member-proficient': memberProficient,
            'member-unproficient': memberAbility && !memberProficient,
          },
        ]}
        data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ABILITY_CONTAINER}
        data-tooltip-direction="RIGHT"
        data-key={ability.key}
        onmouseover={(ev) =>
          tooltip?.tryShow(ev, {
            key: ability.key,
            label: ability.name,
            members: Array.from(context.members.all.values()),
          })}
      >
        <button
          type="button"
          class="button button-borderless use-ability-roll-button ability"
          onclick={(event) =>
            context.sheet.onRollAbility({ ability: ability.key, event })}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ABILITY_ROLLER}
          disabled={!context.owner}
        >
          {ability.name}
        </button>
        {#if memberAbility}
          <span class="ability-measure">
            <span class="color-text-lightest font-label-medium"
              >{memberAbility.modSign}</span
            >
            <span class="font-data-medium">{memberAbility.modValue}</span>
          </span>
          <span class="ability-measure">
            <span class="color-text-lightest font-label-medium"
              >{memberAbility.saveSign}</span
            >
            <span class="font-data-medium">{memberAbility.saveValue}</span>
          </span>
        {:else}
          <span class="ability-measure">
            <span class="color-text-lightest font-label-medium"
              >{ability.high.sign}</span
            >
            <span class="font-data-medium">{ability.high.value}</span>
          </span>
          <span class="ability-measure">
            <span class="color-text-lightest font-label-medium"
              >{ability.low.sign}</span
            >
            <span class="font-data-medium">{ability.low.value}</span>
          </span>
        {/if}
      </li>
    {/each}
  </ul>
</div>
