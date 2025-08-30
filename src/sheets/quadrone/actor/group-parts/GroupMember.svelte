<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import type { GroupMemberQuadroneContext } from 'src/types/types';

  type Props = {
    member: GroupMemberQuadroneContext;
  };

  let { member }: Props = $props();

  let actorIsDead = $derived(
    member.actor.system.attributes?.hp?.value === 0 &&
      member.actor.system.attributes?.hp?.max > 0 &&
      (member.actor.system.attributes.death === undefined ||
        (member.actor.system.attributes.death.failure >= 3 &&
          member.actor.system.attributes.death.success < 3)),
  );

  let portraitShape = $derived(ThemeQuadrone.getActorPortraitShape(member.actor));
</script>

<div class="member-vitals-container">
  <div
    class={['actor-image', { dead: actorIsDead }, portraitShape, { video: member.portrait.isVideo }]}
    style="position: relative;"
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

  {#if member.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER}
    <p>Vitals for Character</p>
  {:else if member.actor.type === CONSTANTS.SHEET_TYPE_NPC}
    <p>Vitals for NPC</p>
  {:else if member.actor.type === CONSTANTS.SHEET_TYPE_VEHICLE}
    <p>Vitals for Vehicle</p>
  {/if}
</div>
<div class="member-details-container">
  <h4>
    {member.actor.name}
  </h4>
  {#if member.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER}
    <p>And more cool stuff here for Character</p>
  {:else if member.actor.type === CONSTANTS.SHEET_TYPE_NPC}
    <p>And more cool stuff here for NPC</p>
  {:else if member.actor.type === CONSTANTS.SHEET_TYPE_VEHICLE}
    <p>And more cool stuff here for Vehicle</p>
  {/if}
</div>
