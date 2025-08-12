<script lang="ts">
  import type { Actor5e } from 'src/types/types';
  import RemoveMemberControl from './RemoveMemberControl.svelte';
  import AcShieldBase from 'src/sheets/classic/actor/AcShieldBase.svelte';
  import type { GroupMemberContext } from 'src/types/group.types';
  import { CONSTANTS } from 'src/constants';
  import GroupMemberListItemProfile from './GroupMemberListItemProfile.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getGroupSheetClassicContext } from 'src/sheets/sheet-context.svelte';

  const context = $derived(getGroupSheetClassicContext());

  interface Props {
    member: Actor5e;
    ctx: GroupMemberContext;
  }

  let { member, ctx }: Props = $props();

  const localize = FoundryAdapter.localize;

  function onPerceptionClicked(
    event: MouseEvent & {
      currentTarget: EventTarget & HTMLButtonElement;
    },
  ) {
    if (ctx.perception) {
      member.rollSkill(
        {
          skill: ctx.perception.key,
          event: event,
        },
        {
          options: {
            default: {
              rollMode: CONST.DICE_ROLL_MODES.BLIND,
            },
          },
        },
      );
    }
  }
</script>

<div
  class="group-member-list-item flex-row small-gap align-items-flex-start"
  data-tidy-draggable
  data-member-id={member.id}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_GROUP_MEMBER}
>
  <GroupMemberListItemProfile {member} showHp={ctx.canObserve} />
  <div class="flex-column extra-small-gap flex-1 align-self-center">
    <div
      class="flex-row small-gap align-items-center justify-content-space-between"
    >
      <button
        type="button"
        class="inline-transparent-button highlight-on-hover ff-title fs-lg"
        onclick={() => member.sheet.render(true)}
        disabled={!ctx.canObserve}
        tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
      >
        {member.name}
      </button>
      {#if context.unlocked}
        <RemoveMemberControl memberId={member.id} />
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
          <button
            type="button"
            class="skill"
            disabled={!context.isGM}
            onclick={(event) => onPerceptionClicked(event)}
            tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
          >
            {localize(ctx.perception?.label ?? '')}
            {ctx.perception?.formattedTotal} ({ctx.perception?.passive})
          </button>
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
