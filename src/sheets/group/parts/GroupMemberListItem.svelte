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
      currentTarget: EventTarget & HTMLElement;
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
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_GROUP_MEMBER}
  data-context-menu-document-uuid={member.uuid}
>
  <GroupMemberListItemProfile {member} showHp={ctx.canObserve} />
  <div class="flex-column extra-small-gap flex-1 align-self-center">
    <div
      class="flex-row small-gap align-items-center justify-content-space-between"
    >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        class="inline-transparent-button highlight-on-hover ff-title fs-lg"
        on:click={() => ctx.canObserve && member.sheet.render(true)}
      >
        {member.name}
      </a>
      {#if $context.unlocked}
        <RemoveMemberControl {member} />
      {/if}
    </div>

    {#if ctx.canObserve}
      <div class="flex-row extra-small-gap">
        <AcShieldBase cssClass="group-ac-shield">
          <span class="ac-value">{member.system.attributes.ac.value}</span>
        </AcShieldBase>
        <div class="flex-1">
          <div class="flex-row extra-small-gap">
            <span>
              <i
                class="fas fa-eye fa-fw text-body-secondary"
                title={localize('DND5E.Senses')}
              ></i>
            </span>
            <span>
              {#if ctx.senses.length}
                {ctx.senses.join(', ')}
              {:else}
                <i>{localize('TIDY5E.NoSpecialSenses')}</i>
              {/if}
            </span>
          </div>
          {#if ctx.conditionImmunities.length}
            <div class="flex-row extra-small-gap">
              <span>
                <i
                  class="fas fa-shield-virus fa-fw text-body-secondary"
                  title={localize('DND5E.ConImm')}
                ></i>
              </span>
              <span>
                {ctx.conditionImmunities.join(', ')}
              </span>
            </div>
          {/if}
        </div>
      </div>

      <div class="flex-row flex-wrap skills">
        {#if ctx.perception}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <!-- svelte-ignore a11y-missing-attribute -->
          <a
            class="skill"
            on:click={(event) => $context.isGM && onPerceptionClicked(event)}
          >
            {localize(ctx.perception?.label ?? '')}
            {ctx.perception?.formattedTotal} ({ctx.perception?.passive})
          </a>
        {/if}
        {#each ctx.topSkills as skill (skill.key)}
          <span class="skill">
            {localize(skill?.label ?? '')}
            {skill?.formattedTotal}
          </span>
        {/each}
      </div>
    {/if}
  </div>
</div>
