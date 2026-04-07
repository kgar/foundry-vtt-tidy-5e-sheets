<script lang="ts">
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

  let showSpecificMemberValues = $derived(
    emphasizedMember &&
      !![...context.members.all.values()].find(
        (m) => m.actor.uuid === emphasizedMember?.actor.uuid,
      ),
  );

  let tooltip = $state<GroupAbilityTooltip | undefined>();

  const localize = FoundryAdapter.localize;

  let view: 'abilities' | 'saves' = $state('abilities');

  function toggleView() {
    view = view === 'abilities' ? 'saves' : 'abilities';
  }
</script>

<GroupAbilityTooltip bind:this={tooltip} sheetDocument={context.document} />

<div class="abilities card">
  <div class="use-ability-header flexrow">
    <button type="button" class="button button-borderless" onclick={toggleView}>
      <h3 class="font-label-medium">
        {#if view === 'abilities'}
          {localize('DND5E.Abilities')}
        {:else if view === 'saves'}
          {localize('DND5E.ClassSaves')}
        {/if}
        <i class="fa-solid fa-arrow-right-arrow-left"></i>
      </h3>
    </button>
    <span class="modifier-label color-text-lightest font-default-medium">
      <!-- TODO: Make some snippets and colocate relevant headers / rows to make this read cleaner -->
      {#if showSpecificMemberValues && view === 'abilities'}
        <span class="ability-measure-header">
          {localize('DND5E.AbilityModifierShort')}
        </span>
        <span class="ability-measure-header">
          {localize('DND5E.AbilityScoreShort')}
        </span>
      {:else if showSpecificMemberValues && view === 'saves'}
        <!-- Saving throws have one column -->
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
        <!-- TODO: To sheet action ;) ; and TODO: other group rolls to sheet actions -->
        <button
          type="button"
          class="button button-borderless use-ability-roll-button ability"
          onclick={(event) =>
            view === 'abilities'
              ? context.sheet.onRollAbility({ ability: ability.key, event })
              : context.sheet.onRollSavingThrow({
                  ability: ability.key,
                  event,
                })}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ABILITY_ROLLER}
          disabled={!context.owner}
        >
          {ability.name}
        </button>
        {#if memberAbility && view === 'abilities'}
          <span class="ability-measure">
            <span class="color-text-lightest font-label-medium"
              >{memberAbility.modSign}</span
            >
            <span class="font-data-medium">{memberAbility.modValue}</span>
          </span>
          <span class="ability-measure">
            {#if memberAbility.score < 0}
              <span class="color-text-lightest font-label-medium"
                >{memberAbility.scoreSign}</span
              >
            {/if}
            <span class="font-data-medium">{memberAbility.score}</span>
          </span>
        {:else if memberAbility && view === 'saves'}
          <!-- Saving throws have one column -->
          <span class="ability-measure">
            <span class="color-text-lightest font-label-medium"
              >{memberAbility.saveSign}</span
            >
            <span class="font-data-medium">{memberAbility.saveValue}</span>
          </span>
        {:else if view === 'abilities'}
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
        {:else if view === 'saves'}
          <span class="ability-measure">
            <span class="color-text-lightest font-label-medium"
              >{ability.saveHigh.sign}</span
            >
            <span class="font-data-medium">{ability.saveHigh.value}</span>
          </span>
          <span class="ability-measure">
            <span class="color-text-lightest font-label-medium"
              >{ability.saveLow.sign}</span
            >
            <span class="font-data-medium">{ability.saveLow.value}</span>
          </span>
        {/if}
      </li>
    {/each}
  </ul>
</div>
