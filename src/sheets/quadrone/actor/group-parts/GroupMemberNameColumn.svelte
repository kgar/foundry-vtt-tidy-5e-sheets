<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import type { GroupMemberQuadroneContext } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { Ref } from 'src/features/reactivity/reactivity.types';

  let localize = FoundryAdapter.localize;

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

  let portraitShape = $derived(
    ThemeQuadrone.getActorPortraitShape(member.actor),
  );

  let emphasizedActorRef = getContext<
    Ref<GroupMemberQuadroneContext | undefined>
  >(CONSTANTS.SVELTE_CONTEXT.EMPHASIZED_MEMBER_REF);
</script>

<div class="tidy-table-cell actor-image-container">
  <div
    role="button"
    tabindex={0}
    class={[
      'actor-image',
      { dead: actorIsDead },
      portraitShape,
      { video: member.portrait.isVideo },
    ]}
    style="position: relative;"
    onclick={() => member.actor.sheet.render(true)}
    onkeydown={(e) =>
      e.key === 'Enter' || e.key === ' '
        ? member.actor.sheet.render(true)
        : null}
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
</div>
<div class="tidy-table-cell text-cell primary item-label flexcol">
  <div
    class="actor-name"
    role="button"
    tabindex={0}
    onclick={() => member.actor.sheet.render(true)}
    onkeydown={(e) =>
      e.key === 'Enter' || e.key === ' '
        ? member.actor.sheet.render(true)
        : null}
    onmouseenter={() => (emphasizedActorRef.value = member)}
    onmouseleave={() => (emphasizedActorRef.value = undefined)}
  >
    <h4 class="font-label-medium">
      {member.actor.name}
    </h4>
    {#if member.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER}
      {#each member.actor.classes as thisClass}
        <span class="font-label-medium color-text-gold">{thisClass.name}</span>
        <span class="font-data-medium color-text-default"
          >{thisClass.levels}</span
        >
      {/each}
    {:else if member.actor.type === CONSTANTS.SHEET_TYPE_NPC}
      <span class="flexrow">
        {#each member.actor.classes as thisClass}
          <span class="font-label-medium color-text-gold">{thisClass.name}</span>
          <span class="font-data-medium color-text-default"
            >{thisClass.levels}</span
          >
        {/each}
        <span class="cr">
          <span class="font-label-medium color-text-gold">CR</span>
          <span class="font-data-medium color-text-default">5</span>
        </span>
        <div class="divider-dot"></div>
        <span class="size">
          <span class="font-label-medium color-text-gold">Mediumish</span>
        </span>
        <!-- {#if member.actor.creatureType.title} -->
        <div class="divider-dot"></div>
        <span class="creature-type">
          <span class="font-label-medium color-text-gold">
            TODO
            <!-- {member.actor.creatureType.title}
            {#if member.actor.creatureType.subtitle}
              ({member.actor.creatureType.subtitle})
            {/if} -->
          </span>
        </span>
      </span>
      <!-- {/if} -->
    {:else if member.actor.type === CONSTANTS.SHEET_TYPE_VEHICLE}
      <span
        class="font-label-medium color-text-gold"
        title={localize('DND5E.VehicleType')}
        >{localize('DND5E.VehicleType')} ({member.actor.system
          .vehicleType})</span
      >
    {/if}
  </div>
</div>
