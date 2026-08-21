<script lang="ts">
  import type { 
    GroupMemberQuadroneContext, 
    EncounterMemberQuadroneContext, 
    EncounterMemberCombatantQuadroneContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import { CONSTANTS } from 'src/constants';

  type Props = {
    member:
      GroupMemberQuadroneContext | EncounterMemberQuadroneContext | EncounterMemberCombatantQuadroneContext;
  };

  let { member }: Props = $props();

  let actorIsDead = $derived(
    member.actor.system.attributes?.hp?.value === 0 &&
      member.actor.system.attributes?.hp?.max > 0 &&
      (member.actor.system.attributes.death === undefined ||
        (member.actor.system.attributes.death.failure >= 3 &&
          member.actor.system.attributes.death.success < 3)),
  );

  let emphasizedActorRef = getContext<
    Ref<
      | GroupMemberQuadroneContext
      | EncounterMemberQuadroneContext
      | EncounterMemberCombatantQuadroneContext
      | undefined
    >
  >(CONSTANTS.SVELTE_CONTEXT.EMPHASIZED_MEMBER_REF);
</script>

<div
  role="button"
  data-keyboard-focus
  tabindex={0}
  class={[
    'actor-image',
    { dead: actorIsDead },
    member.portrait.shape,
    { video: member.portrait.isVideo },
  ]}
  style="position: relative;"
  data-action="showDocument"
  data-uuid={member.actor.uuid}
  onmouseenter={() => (emphasizedActorRef.value = member)}
  onmouseleave={() => (emphasizedActorRef.value = undefined)}
  >
  {#if member.portrait.isVideo}
    <video
      src={member.portrait.src}
      autoplay
      muted
      playsinline
      disablepictureinpicture
      loop
      class={{ dead: actorIsDead }}
    ></video>
  {:else}
    <img
      src={member.portrait.src}
      alt={member.actor.name}
      class={{ dead: actorIsDead }}
    />
  {/if}
  {#if actorIsDead}
    <div class="dead-overlay"></div>
  {/if}
</div>