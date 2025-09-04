<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import GroupSkills from './GroupSkillsCard.svelte';
  import { getContext } from 'svelte';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import { CONSTANTS } from 'src/constants';
  import type { ClassValue } from 'svelte/elements';
  import type { Actor5e, GroupMemberQuadroneContext } from 'src/types/types';
  import GroupTraitPill from '../GroupTraitPill.svelte';
  import GroupToolTooltip from 'src/tooltips/GroupToolTooltip.svelte';

  let context = $derived(getGroupSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let emphasizedActorRef = getContext<
    Ref<GroupMemberQuadroneContext | undefined>
  >(CONSTANTS.SVELTE_CONTEXT.EMPHASIZED_MEMBER_REF);

  let emphasizedMember = $derived(emphasizedActorRef.value);

  let emphasizedActorUuid = $derived<string>(
    emphasizedMember?.actor.uuid ?? '',
  );

  let toolTooltip = $state<GroupToolTooltip | undefined>();

  let actorMap = $derived(
    context.system.members.reduce(
      (map: Map<string, Actor5e>, member: any) =>
        map.set(member.actor.uuid, member.actor),
      new Map<string, Actor5e>(),
    ),
  );
</script>

<aside
  class="sidebar"
  style:--t5e-member-color-hover={emphasizedMember?.highlightColor}
  style:--t5e-member-color-background={emphasizedMember?.backgroundColor}
>
  <!-- Aggregate Traits -->
  <div class="list traits">
    <!-- Languages -->
    <div class="list-entry">
      <div class="list-label flexrow">
        <h4 class="font-weight-label">
          <i class="fa-solid fa-comments"></i>
          {localize('DND5E.Languages')}
        </h4>
      </div>
      <div class="list-content">
        <div class="list-values">
          <ul class="pills">
            {#each context.traits.languages as language}
              {@const isEmphasized =
                emphasizedMember !== undefined &&
                language.identifiers.has(emphasizedActorUuid)}
              {@const pillState: ClassValue = {
                emphasized: isEmphasized,
                'theme-dark': isEmphasized,
                diminished: emphasizedMember !== undefined && !isEmphasized,
              }}
              {@const pill =
                language.identifiers.get(emphasizedActorUuid) ?? language}

              <GroupTraitPill
                class={pillState}
                count={language.identifiers.size}
                label={pill.label}
                units={pill.units}
                value={pill.value}
              />
            {/each}
          </ul>
        </div>
      </div>
    </div>
    <!-- Speeds -->
    <div class="list-entry">
      <div class="list-label flexrow">
        <h4 class="font-weight-label">
          <i class="fa-solid fa-rabbit-running"></i>
          {localize('DND5E.Speed')}
        </h4>
      </div>
      <div class="list-content">
        <div class="list-values">
          <ul class="pills">
            {#each context.traits.speeds as speed}
              {@const isEmphasized =
                emphasizedMember !== undefined &&
                speed.identifiers.has(emphasizedActorUuid)}
              {@const pillState: ClassValue = {
                emphasized: isEmphasized,
                'theme-dark': isEmphasized,
                diminished: emphasizedMember !== undefined && !isEmphasized,
              }}
              {@const pill =
                speed.identifiers.get(emphasizedActorUuid) ?? speed}

              <GroupTraitPill
                class={pillState}
                label={pill.label}
                units={pill.units}
                value={pill.value}
              />
            {/each}
          </ul>
        </div>
      </div>
    </div>
    <!-- Senses -->
    <div class="list-entry">
      <div class="list-label flexrow">
        <h4 class="font-weight-label">
          <i class="fa-solid fa-eye"></i>
          {localize('DND5E.Senses')}
        </h4>
      </div>
      <div class="list-content">
        <div class="list-values">
          <ul class="pills">
            {#each context.traits.senses as sense}
              {@const isEmphasized =
                emphasizedMember !== undefined &&
                sense.identifiers.has(emphasizedActorUuid)}
              {@const pillState: ClassValue = {
                emphasized: isEmphasized,
                'theme-dark': isEmphasized,
                diminished: emphasizedMember !== undefined && !isEmphasized,
              }}
              {@const pill =
                sense.identifiers.get(emphasizedActorUuid) ?? sense}

              <GroupTraitPill
                class={pillState}
                label={pill.label}
                units={pill.units}
                value={pill.value}
              />
            {/each}
          </ul>
        </div>
      </div>
    </div>

    <!-- Aggregate Skills -->
    <GroupSkills />

    <!-- Specials -->
    <div class="list-entry">
      <div class="list-label flexrow">
        <h4 class="font-weight-label">
          <i class="fa-solid fa-star-sharp"></i>
          {localize('DND5E.Special')}
        </h4>
      </div>
      <div class="list-content">
        <div class="list-values">
          <ul class="pills">
            {#each context.traits.specials as special}
              {@const isEmphasized =
                emphasizedMember !== undefined &&
                special.identifiers.has(emphasizedActorUuid)}
              {@const pillState: ClassValue = {
                emphasized: isEmphasized,
                'theme-dark': isEmphasized,
                diminished: emphasizedMember !== undefined && !isEmphasized,
              }}

              <GroupTraitPill class={pillState} label={special.label} />
            {/each}
          </ul>
        </div>
      </div>
    </div>

    <GroupToolTooltip
      bind:this={toolTooltip}
      sheetDocument={context.document}
    />
    <!-- Tools -->
    <div class="list-entry">
      <div class="list-label flexrow">
        <h4 class="font-weight-label">
          <i class="fa-solid fa-hammer-brush"></i>
          {localize('TYPES.Item.toolPl')}
        </h4>
      </div>
      <div class="list-content">
        <div class="list-values">
          <ul class="pills">
            {#each context.traits.tools as tool}
              {@const isEmphasized =
                emphasizedMember !== undefined &&
                tool.identifiers.has(emphasizedActorUuid)}
              {@const pillState: ClassValue = {
                emphasized: isEmphasized,
                'theme-dark': isEmphasized,
                diminished: emphasizedMember !== undefined && !isEmphasized,
              }}
              <GroupTraitPill
                class={pillState}
                label={tool.label}
                onmouseover={(ev) =>
                  tool.key
                    ? toolTooltip?.tryShow(ev, {
                        key: tool.key,
                        label: tool.label,
                        members: [...tool.identifiers].map((uuid) =>
                          actorMap.get(uuid),
                        ),
                      })
                    : undefined}
              />
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>
</aside>
