<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import GroupSkills from './GroupSkillsCard.svelte';

  let context = $derived(getGroupSheetQuadroneContext());

  let characters = $derived(context.members.character.members);
  let npcs = $derived(context.members.npc.members);

  const localize = FoundryAdapter.localize;
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
            {#each context.members.traits.languages as language}
              <li class="pill pill-medium" data-tooltip-direction="UP">
                <span class="label font-label-medium">{language.label}</span>
                {#if language.identifiers.size > 1}
                  <span>
                    {language.identifiers.size}
                  </span>
                {/if}
                {#if language.value && language.units}
                  <span>
                    <span class="value font-data-medium">{language.value}</span
                    ><span class="units font-default-medium color-text-lighter"
                      >{language.units}</span
                    >
                  </span>
                {:else if language.value}
                  <span class="value font-data-medium">{language.value}</span>
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
            <!-- TODO: This is for demonstrative purposes; apply data -->
            <li class="pill pill-medium" data-tooltip-direction="UP">
              <span class="label font-label-medium"> Walk </span>
              <span>
                <span class="value font-data-medium">60</span><span
                  class="units font-default-medium color-text-lighter">ft</span
                >
              </span>
            </li>
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
            <!-- TODO: This is for demonstrative purposes; apply data -->
            <li class="pill pill-medium" data-tooltip-direction="UP">
              <span class="label font-label-medium"> Darkivision </span>
              <span>
                <span class="value font-data-medium">6000</span><span
                  class="units font-default-medium color-text-lighter">ft</span
                >
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Aggregate Skills -->
  <GroupSkills />

  <!-- Aggregate Special -->
  <div class="list traits">
    <!-- Speed -->
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
            <!-- TODO: Get member.traits.custom for each member! -->
            <!-- {#each characters as character}
              {#each Object.values(character.actor.traits) as trait}
                {#if trait.custom}
                  <li class="pill pill-medium" data-tooltip-direction="UP">
                    <span class="label font-label-medium">{trait.label}</span>
                  </li>
                {/if}
              {/each}
            {/each} -->
          </ul>
        </div>
      </div>
    </div>

    <!-- Aggregate Tools -->
    <!-- Speed -->
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
            <!-- TODO: This is for demonstrative purposes; apply data -->
            <li class="pill pill-medium" data-tooltip-direction="UP">
              <span class="label font-label-medium">Carpenter's Tools</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</aside>
