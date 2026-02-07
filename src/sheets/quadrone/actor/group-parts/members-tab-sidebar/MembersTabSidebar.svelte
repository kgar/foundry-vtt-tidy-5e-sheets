<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import GroupSkills from './GroupSkillsCard.svelte';
  import { getContext } from 'svelte';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import { CONSTANTS } from 'src/constants';
  import type { ClassValue } from 'svelte/elements';
  import type {
    GroupMemberQuadroneContext,
    GroupTraitBase,
  } from 'src/types/types';
  import GroupTraitPill from '../GroupTraitPill.svelte';
  import GroupToolTooltip from 'src/tooltips/GroupToolTooltip.svelte';
  import GroupTraitTooltip from 'src/tooltips/GroupTraitTooltip.svelte';
  import ActorCustomTraitListEntries from '../../parts/ActorCustomTraitListEntries.svelte';

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
  let traitTooltip = $state<GroupTraitTooltip | undefined>();

  function getTooltipMembersFromMeasureableTrait(
    identifiers: Map<string, GroupTraitBase<any>>,
  ) {
    return [...identifiers].map(([uuid, value]) => ({
      context: context.members.all.get(uuid) as GroupMemberQuadroneContext, // TODO: Change to reduce to avoid TS funny business
      units: value.units,
      value: value.value?.toString(),
    }));
  }
</script>

<GroupTraitTooltip bind:this={traitTooltip} sheetDocument={context.actor} />

<GroupToolTooltip bind:this={toolTooltip} sheetDocument={context.document} />

<aside
  class="sidebar expanded"
  style:--t5e-member-color-hover={emphasizedMember?.highlightColor}
  style:--t5e-member-color-background={emphasizedMember?.backgroundColor}
>
  <!-- Aggregate Traits -->
  <div class="list traits">
    <!-- Languages -->
    <div class="list-entry traits-languages">
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
                'trait-language': true,
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
                onmouseover={(ev) =>
                  traitTooltip?.tryShow(ev, {
                    label: language.label,
                    members: getTooltipMembersFromMeasureableTrait(
                      language.identifiers,
                    ),
                  })}
              />
            {/each}
          </ul>
        </div>
      </div>
    </div>
    <!-- Speeds -->
    <div class="list-entry traits-speeds">
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
                'trait-speed': true,
                diminished: emphasizedMember !== undefined && !isEmphasized,
              }}
              {@const pill =
                speed.identifiers.get(emphasizedActorUuid) ?? speed}

              <GroupTraitPill
                class={pillState}
                label={pill.label}
                units={pill.units}
                value={pill.value}
                onmouseover={(ev) =>
                  traitTooltip?.tryShow(ev, {
                    label: speed.label,
                    members: getTooltipMembersFromMeasureableTrait(
                      speed.identifiers,
                    ),
                  })}
              />
            {/each}
          </ul>
        </div>
      </div>
    </div>
    <!-- Senses -->
    <div class="list-entry traits-senses">
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
                'trait-sense': true,
                diminished: emphasizedMember !== undefined && !isEmphasized,
              }}
              {@const pill =
                sense.identifiers.get(emphasizedActorUuid) ?? sense}

              <GroupTraitPill
                class={pillState}
                label={pill.label}
                units={pill.units}
                value={pill.value}
                onmouseover={(ev) =>
                  traitTooltip?.tryShow(ev, {
                    label: sense.label,
                    members: getTooltipMembersFromMeasureableTrait(
                      sense.identifiers,
                    ),
                  })}
              />
            {/each}
          </ul>
        </div>
      </div>
    </div>

    <ActorCustomTraitListEntries configButtonLocation="label" />

    <!-- Aggregate Skills -->
    <GroupSkills />

    <!-- Specials -->
    <div class="list-entry traits-specials">
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
                'trait-special': true,
                diminished: emphasizedMember !== undefined && !isEmphasized,
              }}

              <GroupTraitPill
                class={pillState}
                label={special.label}
                onmouseover={(ev) =>
                  traitTooltip?.tryShow(ev, {
                    label: special.label,
                    members: [...special.identifiers].map((s) => ({
                      context: context.members.all.get(
                        s,
                      ) as GroupMemberQuadroneContext, // TODO: Change to reduce to avoid TS funny business
                    })),
                  })}
              />
            {/each}
          </ul>
        </div>
      </div>
    </div>

    <!-- Tools -->
    <div class="list-entry traits-tools">
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
                'trait-tool': true,
                diminished: emphasizedMember !== undefined && !isEmphasized,
              }}
              <GroupTraitPill
                class={pillState}
                label={tool.label}
                onmouseover={(ev) =>
                  tool.key &&
                  toolTooltip?.tryShow(ev, {
                    key: tool.key,
                    label: tool.label,
                    members: [...tool.identifiers].map(
                      (s) =>
                        context.members.all.get(
                          s,
                        ) as GroupMemberQuadroneContext, // TODO: Change to reduce to avoid TS funny business
                    ),
                  })}
              />
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>
</aside>
