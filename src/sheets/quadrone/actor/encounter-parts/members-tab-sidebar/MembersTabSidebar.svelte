<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import EncounterSkills from './EncounterSkills.svelte';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { CONSTANTS } from 'src/constants';
  import type {
    EncounterMemberQuadroneContext,
    GroupTraitBase,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import GroupTraitTooltip from 'src/tooltips/GroupTraitTooltip.svelte';
  import type { ClassValue } from 'svelte/elements';
  import GroupTraitPill from '../../group-parts/GroupTraitPill.svelte';

  let context = $derived(getEncounterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let emphasizedActorRef = getContext<
    Ref<EncounterMemberQuadroneContext | undefined>
  >(CONSTANTS.SVELTE_CONTEXT.EMPHASIZED_MEMBER_REF);

  let emphasizedMember = $derived(emphasizedActorRef.value);

  let emphasizedActorUuid = $derived<string>(
    emphasizedMember?.actor.uuid ?? '',
  );

  let traitTooltip = $state<GroupTraitTooltip | undefined>();

  function getTooltipMembersFromMeasureableTrait(
    identifiers: Map<string, GroupTraitBase<any>>,
  ) {
    return [...identifiers].map(([uuid, value]) => ({
      context: context.members.all.get(uuid) as EncounterMemberQuadroneContext, // TODO: Change to reduce to avoid TS funny business
      units: value.units,
      value: value.value?.toString(),
    }));
  }
</script>

<GroupTraitTooltip bind:this={traitTooltip} sheetDocument={context.actor} />

<aside
  class="sidebar"
  style:--t5e-member-color-hover={emphasizedMember?.highlightColor}
  style:--t5e-member-color-background={emphasizedMember?.backgroundColor}
>
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
    <div class="list-entry">
      <div class="list-label flexrow">
        <h4 class="font-weight-label">
          <i class="fa-solid fa-comments"></i>
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
    <div class="list-entry">
      <div class="list-label flexrow">
        <h4 class="font-weight-label">
          <i class="fa-solid fa-comments"></i>
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

    <!-- Skills -->
    <EncounterSkills />

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

              <GroupTraitPill
                class={pillState}
                label={special.label}
                onmouseover={(ev) =>
                  traitTooltip?.tryShow(ev, {
                    label: special.label,
                    members: [...special.identifiers].map((s) => ({
                      context: context.members.all.get(
                        s,
                      ) as EncounterMemberQuadroneContext, // TODO: Change to reduce to avoid TS funny business
                    })),
                  })}
              />
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>
</aside>
