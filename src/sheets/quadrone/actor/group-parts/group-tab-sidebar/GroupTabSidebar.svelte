<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import GroupSkills from './GroupSkillsCard.svelte';
  import { getContext } from 'svelte';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import { CONSTANTS } from 'src/constants';
  import type { ClassValue } from 'svelte/elements';

  let context = $derived(getGroupSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let emphasizedActorRef = getContext<Ref<string | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.EMPHASIZED_ACTOR_REF,
  );

  let emphasizedActor = $derived(emphasizedActorRef.value);
</script>

<aside class="sidebar">
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
              {@const pillState: ClassValue = {
                emphasized: emphasizedActor !== undefined && language.identifiers.has(emphasizedActor),
                diminished: emphasizedActor !== undefined && !language.identifiers.has(emphasizedActor),
              }}
              {@const pill =
                language.identifiers.get(emphasizedActor ?? '') ?? language}

              <li
                class={['pill pill-medium', pillState]}
                data-tooltip-direction="UP"
              >
                <span class="label font-label-medium">{pill.label}</span>
                {#if language.identifiers.size > 1}
                  <span>
                    {language.identifiers.size}
                  </span>
                {/if}
                {#if pill.value && pill.units}
                  <span>
                    <span class="value font-data-medium">{pill.value}</span
                    ><span class="units font-default-medium color-text-lighter"
                      >{pill.units}</span
                    >
                  </span>
                {:else if pill.value}
                  <span class="value font-data-medium">{pill.value}</span>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
    <!-- Speed -->
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
              {@const pillState: ClassValue = {
                emphasized: emphasizedActor !== undefined && speed.identifiers.has(emphasizedActor),
                diminished: emphasizedActor !== undefined && !speed.identifiers.has(emphasizedActor),
              }}
              {@const pill =
                speed.identifiers.get(emphasizedActor ?? '') ?? speed}
              <li
                class={['pill pill-medium', pillState]}
                data-tooltip-direction="UP"
              >
                <span class="label font-label-medium">{pill.label}</span>
                {#if pill.value && pill.units}
                  <span>
                    <span class="value font-data-medium">{pill.value}</span
                    ><span class="units font-default-medium color-text-lighter"
                      >{pill.units}</span
                    >
                  </span>
                {:else if pill.value}
                  <span class="value font-data-medium">{pill.value}</span>
                {/if}
              </li>
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
              {@const pillState: ClassValue = {
                emphasized: emphasizedActor !== undefined && sense.identifiers.has(emphasizedActor),
                diminished: emphasizedActor !== undefined && !sense.identifiers.has(emphasizedActor),
              }}
              {@const pill =
                sense.identifiers.get(emphasizedActor ?? '') ?? sense}
              <li
                class={['pill pill-medium', pillState]}
                data-tooltip-direction="UP"
              >
                <span class="label font-label-medium">{pill.label}</span>
                {#if pill.value && pill.units}
                  <span>
                    <span class="value font-data-medium">{pill.value}</span
                    ><span class="units font-default-medium color-text-lighter"
                      >{pill.units}</span
                    >
                  </span>
                {:else if pill.value}
                  <span class="value font-data-medium">{pill.value}</span>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Aggregate Skills -->
  <GroupSkills />

  <!-- Aggregate Special -->
  <div class="list traits">
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
              {@const pillState: ClassValue = {
                emphasized: emphasizedActor !== undefined && special.identifiers.has(emphasizedActor),
                diminished: emphasizedActor !== undefined && !special.identifiers.has(emphasizedActor),
              }}
              <li
                class={['pill pill-medium', pillState]}
                data-tooltip-direction="UP"
              >
                <span class="label font-label-medium">{special.label}</span>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>

    <!-- Aggregate Tools -->
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
              {@const pillState: ClassValue = {
                emphasized: emphasizedActor !== undefined && tool.identifiers.has(emphasizedActor),
                diminished: emphasizedActor !== undefined && !tool.identifiers.has(emphasizedActor),
              }}
              <li
                class={['pill pill-medium', pillState]}
                data-tooltip-direction="UP"
              >
                <span class="label font-label-medium">{tool.label}</span>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>
</aside>
