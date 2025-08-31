<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import type { GroupMemberQuadroneContext } from 'src/types/types';
  import InspirationBadge from '../character-parts/InspirationBadge.svelte';

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

<div class="tidy-table-row">
  <div class="tidy-table-cell member-vitals-container">
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
  </div>
  <div class="tidy-table-cell text-cell primary item-label flexcol">
    <a class="item-name">
      <h4>
        {member.actor.name}
      </h4>
      {#if member.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER}
        {#each member.actor.classes as thisClass}
          <span class="font-label-medium color-text-gold">{thisClass.name}</span>
          <span class="font-data-medium color-text-default">{thisClass.levels}</span>
        {/each}
      {:else if member.actor.type === CONSTANTS.SHEET_TYPE_NPC}
        <p>And more cool stuff here for NPC</p>
      {:else if member.actor.type === CONSTANTS.SHEET_TYPE_VEHICLE}
        <p>And more cool stuff here for Vehicle</p>
      {/if}
    </a>
  </div>
  {#if member.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER}
    <div class="tidy-table-cell inspiration-container">
      <InspirationBadge />
    </div>
  {/if}
  <div class="tidy-table-cell">
    <div class="meter meter-small progress hit-points"></div>
    <div class="flexrow">
      <span class="font-data-medium color-text-default">{member.actor.system.attributes.hp.value}</span>
      <span class="font-body-medium color-text-lightest separator">/</span>
      <span class="font-label-medium color-text-default">{member.actor.system.attributes.hp.max}</span>
    </div>
  </div>
  {#if member.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER || member.actor.type === CONSTANTS.SHEET_TYPE_NPC}
    <div class="tidy-table-cell">
      <div class="meter meter-small progress hit-die"></div>
      <div class="flexrow">
        <span class="font-data-medium color-text-default">{member.actor.system.attributes.hd.value}</span>
        <span class="font-body-medium color-text-lightest separator">/</span>
        <span class="font-label-medium color-text-default">{member.actor.system.attributes.hd.max}</span>
      </div>
    </div>
  {/if}
  <div class="tidy-table-cell">
    <span class="font-data-large color-text-default">{member.actor.system.attributes.ac.value}</span>
  </div>
  {#if member.actor.type === CONSTANTS.SHEET_TYPE_VEHICLE}
    <div class="tidy-table-cell">
      <span class="font-data-large color-text-{member.actor.system.attributes.hp.dt ? 'default' : 'lightest'}">{member.actor.system.attributes.hp.dt ?? '—'}</span>
    </div>
  {/if}
  {#if member.actor.type !== CONSTANTS.SHEET_TYPE_VEHICLE}
    <div class="tidy-table-cell">
      {#if member.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER}
        <div class="meter meter-small progress xp"></div>
        <span class="font-data-medium color-text-default">{member.actor.system.details.xp.value}</span>
      {:else if member.actor.type === CONSTANTS.SHEET_TYPE_NPC}
        <span class="font-data-large color-text-default">{member.actor.system.details.xp.value}</span>
      {/if}
    </div>
  {/if}
  {#if member.actor.type === CONSTANTS.SHEET_TYPE_VEHICLE}
    <div class="tidy-table-cell">
      <div class="meter meter-small progress capacity"></div>
      <div class="flexrow">
        <span class="font-data-large color-text-default">{member.actor.system.attributes.capacity.creature}</span>
        <span class="font-body-medium color-text-lightest separator">/</span>
        <span class="font-label-medium color-text-default">{member.actor.system.attributes.capacity.creature}</span>
      </div>
    </div>
  {/if}
  {#if member.actor.type === CONSTANTS.SHEET_TYPE_VEHICLE}
    <div class="tidy-table-cell">
      <div class="meter meter-small progress capacity"></div>
      <div class="flexrow">
        <span class="font-data-large color-text-default">{member.actor.system.attributes.capacity.cargo}</span>
        <span class="font-body-medium color-text-lightest separator">/</span>
        <span class="font-label-medium color-text-default">{member.actor.system.attributes.capacity.cargo}</span>
      </div>
    </div>
  {/if}
</div>