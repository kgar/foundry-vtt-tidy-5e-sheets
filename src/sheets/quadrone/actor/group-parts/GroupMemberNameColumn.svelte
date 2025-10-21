<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import type { GroupMemberQuadroneContext } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import type { Item5e } from 'src/types/item.types';

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

  let emphasizedActorRef = getContext<
    Ref<GroupMemberQuadroneContext | undefined>
  >(CONSTANTS.SVELTE_CONTEXT.EMPHASIZED_MEMBER_REF);
</script>

<div class="tidy-table-cell actor-image-container">
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
    data-keyboard-focus
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
    {#if member.canObserve}
      {#if member.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER}
        {@const classes = Object.values<Item5e>(member.actor.classes)}
        {#if classes.length > 0}
          <div class="separated-list">
            {#each classes as thisClass, index}
              <div class="class-names">
                <span class="font-label-medium color-text-gold-emphasis"
                  >{thisClass.name}</span
                >
                <span class="font-data-medium color-text-default"
                  >{thisClass.system.levels}</span
                >
              </div>
              {#if index < classes.length - 1}
                <div class="divider-dot"></div>
              {/if}
            {/each}
          </div>
        {/if}
      {:else if member.actor.type === CONSTANTS.SHEET_TYPE_NPC}
        {@const formattedCr = dnd5e.utils.formatCR(
          member.actor.system.details.cr,
        )}

        {@const size =
          CONFIG.DND5E.actorSizes[member.actor.system.traits.size]?.label ??
          member.actor.system.traits.size}

        {@const creatureType = member.actor.system.details.type.label}

        {@const classes = Object.values<Item5e>(member.actor.classes)}

        <span class="separated-list">
          {#each classes as thisClass, index}
            <div class="class-names">
              <span class="font-label-medium color-text-gold-emphasis"
                >{thisClass.name}</span
              >
              <span class="font-data-medium color-text-default"
                >{thisClass.system.levels}</span
              >

              <div class="divider-dot"></div>
            </div>
          {/each}

          <span class="cr">
            <span class="font-label-medium color-text-gold-emphasis"
              >{localize('DND5E.AbbreviationCR')}</span
            >
            <span class="font-data-medium color-text-default"
              >{formattedCr}</span
            >
          </span>

          <div class="divider-dot"></div>
          <span class="size">
            <span class="font-label-medium color-text-gold-emphasis"
              >{size}</span
            >
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
      {:else if member.actor.type === CONSTANTS.SHEET_TYPE_VEHICLE}
        {@const vehicleType =
          CONFIG.DND5E.vehicleTypes[member.actor.system.vehicleType] ??
          member.actor.system.vehicleType}

        <span class="font-label-medium color-text-gold-emphasis"
          >{vehicleType}</span
        >
      {/if}
    {/if}
  </div>
</div>
