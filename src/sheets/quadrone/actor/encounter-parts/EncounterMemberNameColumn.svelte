<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type {
    EncounterMemberCombatantQuadroneContext,
    EncounterMemberQuadroneContext,
  } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import ActorTableImage from 'src/sheets/quadrone/shared/ActorTableImage.svelte';

  type Props = {
    member:
      EncounterMemberQuadroneContext | EncounterMemberCombatantQuadroneContext;
  };

  let { member }: Props = $props();

  let emphasizedActorRef = getContext<
    Ref<
      | EncounterMemberQuadroneContext
      | EncounterMemberCombatantQuadroneContext
      | undefined
    >
  >(CONSTANTS.SVELTE_CONTEXT.EMPHASIZED_MEMBER_REF);

</script>

<div class="tidy-table-cell actor-image-container">
  <ActorTableImage {member} />
</div>
<div class="tidy-table-cell text-cell primary item-label flexcol">
  <div
    class="actor-name"
    role="button"
    data-keyboard-focus
    tabindex={0}
    data-action="showDocument"
    data-uuid={member.actor.uuid}
    onmouseenter={() => (emphasizedActorRef.value = member)}
    onmouseleave={() => (emphasizedActorRef.value = undefined)}
  >
    <h4 class="font-label-medium">
      {member.actor.name}
    </h4>
    {#if member.actor.system.details.cr}
      {const size = $derived(
        CONFIG.DND5E.actorSizes[member.actor.system.traits.size]?.label ??
          member.actor.system.traits.size,
      )}

      {const creatureType = $derived(member.actor.system.details.type.label)}

      <span class="separated-list">
        <!-- <span class="cr">
          <span class="font-label-medium color-text-gold-emphasis"
            >{localize('DND5E.AbbreviationCR')}</span
          >
          <span class="font-data-medium color-text-default">{formattedCr}</span>
        </span>
        <div class="divider-dot"></div> -->
        <span class="size">
          <span class="font-label-medium color-text-gold-emphasis">{size}</span>
        </span>
        {#if creatureType}
          <div class="divider-dot"></div>
          <span class="creature-type">
            <span class="font-label-medium color-text-gold-emphasis">
              {creatureType}
            </span>
          </span>
        {/if}
      </span>
    {/if}
  </div>
</div>
