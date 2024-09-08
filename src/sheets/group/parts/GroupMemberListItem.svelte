<script lang="ts">
  import type { Actor5e } from 'src/types/types';
  import RemoveMemberControl from './RemoveMemberControl.svelte';
  import AcShieldBase from 'src/sheets/actor/AcShieldBase.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type {
    GroupMemberContext,
    GroupSheetClassicContext,
  } from 'src/types/group.types';
  import { CONSTANTS } from 'src/constants';
  import GroupMemberListItemProfile from './GroupMemberListItemProfile.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  export let member: Actor5e;
  export let ctx: GroupMemberContext;

  const localize = FoundryAdapter.localize;

  function onPerceptionClicked(
    event: MouseEvent & {
      currentTarget: EventTarget & HTMLButtonElement;
    },
  ) {
    if (ctx.perception) {
      member.rollSkill(ctx.perception.key, {
        rollMode: CONST.DICE_ROLL_MODES.BLIND,
        event: event,
      });
    }
  }
</script>

<div
  class="group-member-list-item flex-row small-gap align-items-flex-start"
  data-member-drag
  data-member-id={member.id}
>
  <GroupMemberListItemProfile {member} showHp={ctx.canObserve} />
  <div class="flex-column extra-small-gap flex-1 align-self-center">
    <div
      class="flex-row small-gap align-items-center justify-content-space-between"
    >
      <button
        type="button"
        class="inline-transparent-button highlight-on-hover ff-title fs-lg"
        on:click={() => member.sheet.render(true)}
        disabled={!ctx.canObserve}
      >
        {member.name}
      </button>
      {#if $context.unlocked}
        <RemoveMemberControl {member} />
      {/if}
    </div>

    {#if ctx.canObserve}
      <div class="flex-row extra-small-gap">
        <!-- TODO: Extract to own part component -->
        <AcShieldBase cssClass="group-ac-shield">
          <span class="ac-value">{member.system.attributes.ac.value}</span>
        </AcShieldBase>
        <fieldset class="flex-1">
          <legend class="semibold">
            {localize('DND5E.Senses')}
          </legend>
          {#if ctx.senses.length}
            {ctx.senses.join(', ')}
          {:else}
            <i>{localize('TIDY5E.NoSpecialSenses')}</i>
          {/if}
        </fieldset>
        {#if ctx.conditionImmunities.length}
          <fieldset class="flex-1">
            <legend class="semibold">
              {localize('DND5E.ConImm')}
            </legend>
            {ctx.conditionImmunities.join(', ')}
          </fieldset>
        {/if}
      </div>

      <div class="flex-row flex-wrap skills">
        {#if ctx.perception}
          <button
            type="button"
            class="skill"
            disabled={!$context.isGM}
            on:click={(event) => onPerceptionClicked(event)}
            title={localize(ctx.perception?.label ?? '')}
          >
            <i class="fas fa-eye"></i>
            {ctx.perception?.mod} ({ctx.perception?.passive})
          </button>
        {/if}
        {#each ctx.topSkills as skill (skill.key)}
          <span class="skill">
            {localize(skill?.label ?? '')}
            {skill?.mod}
          </span>
        {/each}
      </div>
    {/if}
  </div>
</div>
