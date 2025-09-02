<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import type { GroupMemberQuadroneContext } from 'src/types/types';
  import InspirationBadge from '../character-parts/InspirationBadge.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { Ref } from 'src/features/reactivity/reactivity.types';

  let localize = FoundryAdapter.localize;

  type Props = {
    member: GroupMemberQuadroneContext;
    meterColumnWidth?: string;
    inspirationColumnWidth?: string;
    acColumnWidth?: string;
  };

  let {
    member,
    meterColumnWidth = '3.75rem',
    inspirationColumnWidth = '4.5rem',
    acColumnWidth = '3rem',
  }: Props = $props();

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

  let themeStyle = $derived(
    member.accentColor ? member.accentColor : undefined,
  );
  let themeHighlightStyle = $derived(
    member.accentColor
      ? 'oklch(from var(--t5e-theme-color-default) calc(l * 1.4) 60% h)'
      : undefined,
  );

  let hpValue = $derived(member.actor.system.attributes?.hp?.value ?? 0);
  let hpPct = $derived(member.actor.system.attributes?.hp?.pct ?? 0);
  let effectiveMaxHp = $derived(
    member.actor.system.attributes?.hp?.effectiveMax ?? 0,
  );

  let hdPct = $derived(member.actor.system.attributes?.hd?.pct ?? 0);

  let emphasizedActorRef = getContext<Ref<string | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.EMPHASIZED_ACTOR_REF,
  );
</script>

<div
  class="tidy-table-row quadrone-theme-root"
  style:--t5e-theme-color-default={themeStyle}
  style:--t5e-theme-color-highlight={themeHighlightStyle}
  style:--t5e-member-color-hover={themeHighlightStyle}
>
  <div class="tidy-table-cell member-vitals-container">
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
      onkeydown={(e) => e.key === 'Enter' || e.key === ' ' ? member.actor.sheet.render(true) : null}
      onmouseenter={() => (emphasizedActorRef.value = member.actor.uuid)}
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
      class="item-name"
      role="button"
      tabindex={0}
      onclick={() => member.actor.sheet.render(true)}
      onkeydown={(e) => e.key === 'Enter' || e.key === ' ' ? member.actor.sheet.render(true) : null}
      onmouseenter={() => (emphasizedActorRef.value = member.actor.uuid)}
      onmouseleave={() => (emphasizedActorRef.value = undefined)}
    >
      <h4>
        {member.actor.name}
      </h4>
      {#if member.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER}
        {#each member.actor.classes as thisClass}
          <span class="font-label-medium color-text-gold">{thisClass.name}</span
          >
          <span class="font-data-medium color-text-default"
            >{thisClass.levels}</span
          >
        {/each}
      {:else if member.actor.type === CONSTANTS.SHEET_TYPE_NPC}
        <span class="flexrow">
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
  {#if member.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER}
    <TidyTableCell
      columnWidth={inspirationColumnWidth}
      class="theme-dark"
      attributes={{ ['data-tidy-column-key']: 'inspiration-container' }}
    >
      <!-- <div class="tidy-table-cell inspiration-container"> -->
      <InspirationBadge
        actor={member.actor}
        inspirationSource={member.inspirationSource}
      />
      <!-- </div> -->
    </TidyTableCell>
  {/if}
  <TidyTableCell
    columnWidth={meterColumnWidth}
    attributes={{ ['data-tidy-column-key']: 'hit-points' }}
  >
    <!-- <div class="tidy-table-cell"> -->
    <div
      class="meter meter-small progress hit-points"
      style="--bar-percentage: {hpPct.toFixed(0)}%"
    ></div>
    <div class="flexrow">
      <span class="font-data-medium color-text-default">{hpValue}</span>
      <span class="font-body-medium color-text-lightest separator">/</span>
      <span class="font-label-medium color-text-default">{effectiveMaxHp}</span>
    </div>
    <!-- </div> -->
  </TidyTableCell>
  {#if member.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER || member.actor.type === CONSTANTS.SHEET_TYPE_NPC}
    <TidyTableCell
      columnWidth={meterColumnWidth}
      attributes={{ ['data-tidy-column-key']: 'hit-die' }}
    >
      <!-- <div class="tidy-table-cell"> -->
      <div
        class="meter meter-small progress hit-die"
        style="--bar-percentage: {hdPct.toFixed(0)}%"
      ></div>
      <div class="flexrow">
        <span class="font-data-medium color-text-default"
          >{member.actor.system.attributes.hd.value}</span
        >
        <span class="font-body-medium color-text-lightest separator">/</span>
        <span class="font-label-medium color-text-default"
          >{member.actor.system.attributes.hd.max}</span
        >
      </div>
      <!-- </div> -->
    </TidyTableCell>
  {/if}
  <TidyTableCell
    columnWidth={acColumnWidth}
    attributes={{ ['data-tidy-column-key']: 'ac' }}
  >
    <!-- <div class="tidy-table-cell"> -->
    <span class="font-data-large color-text-default"
      >{member.actor.system.attributes.ac.value}</span
    >
    <!-- </div> -->
  </TidyTableCell>
  {#if member.actor.type === CONSTANTS.SHEET_TYPE_VEHICLE}
    <TidyTableCell
      columnWidth={acColumnWidth}
      attributes={{ ['data-tidy-column-key']: 'dt' }}
    >
      <!-- <div class="tidy-table-cell"> -->
      <span
        class="font-data-large color-text-{member.actor.system.attributes.hp.dt
          ? 'default'
          : 'lightest'}">{member.actor.system.attributes.hp.dt ?? '—'}</span
      >
      <!-- </div> -->
    </TidyTableCell>
  {/if}
  {#if member.actor.type !== CONSTANTS.SHEET_TYPE_VEHICLE}
    <TidyTableCell
      columnWidth={meterColumnWidth}
      attributes={{ ['data-tidy-column-key']: 'xp' }}
    >
      <!-- <div class="tidy-table-cell"> -->
      {#if member.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER}
        <div
          class="meter meter-small progress xp"
          style="--bar-percentage: {member.actor.system.details.xp.pct}%;"
        ></div>
        <span class="font-data-medium color-text-default"
          >{member.actor.system.details.xp.value}</span
        >
      {:else if member.actor.type === CONSTANTS.SHEET_TYPE_NPC}
        <span class="font-data-large color-text-default"
          >{member.actor.system.details.xp.value}</span
        >
      {/if}
      <!-- </div> -->
    </TidyTableCell>
  {/if}
  {#if member.actor.type === CONSTANTS.SHEET_TYPE_VEHICLE}
    <!-- TODO: Move this to member data prep. -->
    {@const crewCount = member.actor.system.cargo.crew.reduce(
      (total: number, crew: any) => crew.quantity + total,
      0,
    )}
    {@const crewMax = member.actor.system.attributes.capacity.creature}
    {@const crewPct =
      crewMax === 0 ? 0 : Math.clamp((crewCount / crewMax) * 100, 0, 100)}
    <TidyTableCell
      columnWidth={meterColumnWidth}
      attributes={{ ['data-tidy-column-key']: 'crew' }}
    >
      <!-- <div class="tidy-table-cell"> -->
      <div
        class="meter meter-small progress capacity"
        style="--bar-percentage: {crewPct}%;"
      ></div>
      <div class="flexrow">
        <span class="font-data-large color-text-default">{crewCount}</span>
        <span class="font-body-medium color-text-lightest separator">/</span>
        <span class="font-label-medium color-text-default">{crewMax}</span>
      </div>
      <!-- </div> -->
    </TidyTableCell>
  {/if}
  {#if member.actor.type === CONSTANTS.SHEET_TYPE_VEHICLE}
    <!-- TODO: Calculate this properly with reusable vehicle sheet calculations in member data prep. -->
    {@const cargoCount = 75}
    {@const cargoMax = member.actor.system.attributes.capacity.cargo}
    {@const cargoPct =
      cargoMax === 0 ? 0 : Math.clamp((cargoCount / cargoMax) * 100, 0, 100)}
    <TidyTableCell
      columnWidth={meterColumnWidth}
      attributes={{ ['data-tidy-column-key']: 'cargo' }}
    >
      <!-- <div class="tidy-table-cell"> -->
      <div
        class="meter meter-small progress capacity"
        style="--bar-percentage: {cargoPct}%;"
      ></div>
      <div class="flexrow">
        <span class="font-data-large color-text-default">{cargoCount}</span>
        <span class="font-body-medium color-text-lightest separator">/</span>
        <span class="font-label-medium color-text-default">{cargoMax}</span>
      </div>
      <!-- </div> -->
    </TidyTableCell>
  {/if}
  <TidyTableCell
    columnWidth="1.75rem"
    attributes={{ ['data-tidy-column-key']: 'actions' }}
  >
    <!-- <div class="tidy-table-cell"> -->
    <!-- TODO: Add context menu -->
    <!-- <MenuButton
      targetSelector={`[data-member-id="${member.actor.id}"]`}
    /> -->

    <a class="tidy-table-button">
      <i class="fa-solid fa-ellipsis-vertical fa-fw"></i>
    </a>
    <!-- </div> -->
  </TidyTableCell>
</div>
