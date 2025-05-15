<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';
  import ProficiencyCycle from './ProficiencyCycle.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getModifierData } from 'src/utils/formatting';

  const localize = FoundryAdapter.localize;

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );
</script>

<!-- TODO: add tooltips to config buttons -->
<div class="tools">
  <h3>
    <i class="fa-solid fa-hammer color-text-lightest"></i>
    <span>{localize('TYPES.Item.toolPl')}</span>
    <button
      type="button"
      class="button button-borderless button-icon-only"
      onclick={(ev) => FoundryAdapter.renderToolsConfig(context.actor)}
    >
      <i class="fa-solid fa-cog"></i>
    </button>
  </h3>
  {#if context.tools.length}
    <ul>
      {#each context.tools as tool (tool.key)}
        {@const modTotal = getModifierData(tool.total)}

        <li>
          <ProficiencyCycle
            actor={context.actor}
            aria-label={localize(tool.hover)}
            data-tooltip={tool.hover}
            disabled={!context.unlocked}
            path="system.tools.{tool.key}.value"
            type="tool"
            value={context.unlocked ? tool.source.value : tool.value}
          />
          {#if context.unlocked}
            <SelectQuadrone
              document={context.actor}
              field="system.tools.{tool.key}.ability"
              value={tool.source.ability}
              class="skill-ability"
            >
              <SelectOptions
                data={context.config.abilities}
                labelProp="abbreviation"
              />
            </SelectQuadrone>
          {:else}
            <span class="skill-ability tranform-uppercase color-text-gold">
              {tool.abbreviation}
            </span>
          {/if}
          <button
            type="button"
            class="button button-borderless skill-roll-button"
            onclick={(event) =>
              context.actor.rollToolCheck({ tool: tool.key, event })}
            data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILL_ROLLER}
          >
            {tool.label}
          </button>
          <span class="modifier">
            <span class="color-text-lightest">
              {modTotal.sign}
            </span>
            <span>
              {modTotal.value}
            </span>
          </span>
          {#if context.unlocked}
            <button
              type="button"
              class="button button-borderless button-icon-only"
              onclick={(ev) =>
                FoundryAdapter.renderSkillToolConfig(
                  context.actor,
                  'tool',
                  tool.key,
                )}
            >
              <i class="fa-solid fa-cog"></i>
            </button>
          {/if}
        </li>
      {/each}
    </ul>
  {:else}
    <!-- Do we want any kind of content for when there are no proficient tools? -->
  {/if}
</div>
