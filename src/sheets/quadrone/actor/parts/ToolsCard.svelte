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
  import FiligreeCard from 'src/components/filigree-card/FiligreeCard.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getModifierData } from 'src/utils/formatting';
  import { isNil } from 'src/utils/data';

  const localize = FoundryAdapter.localize;

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  let references = $derived(
    context.tools.reduce<Record<string, string>>((prev, tool) => {
      const id = CONFIG.DND5E.tools[tool.key]?.id;

      if (!isNil(id, '')) {
        prev[tool.key] = dnd5e.documents.Trait.getBaseItemUUID(id);
      }

      return prev;
    }, {}),
  );
</script>

<!-- TODO: add tooltips to config buttons -->
<FiligreeCard class="tools card">
  <div class="use-ability-header flexrow">
    <button
      type="button"
      class="button button-borderless skill-expand-button"
      class:view-only={!context.unlocked}
      onclick={() =>
        context.unlocked && FoundryAdapter.renderToolsConfig(context.actor)}
    >
      <i class="fa-solid fa-hammer color-icon-diminished"></i>
      <h3 class="font-label-medium">
        <span>{localize('TYPES.Item.toolPl')}</span>
        {#if context.unlocked}
          <i class="fa-solid fa-cog button-config"></i>
        {/if}
      </h3>
      <span class="modifier-label color-text-lightest font-default-medium">
        {localize('DND5E.Modifier')}
      </span>
    </button>
  </div>
  {#if context.tools.length}
    <ul class="tool-list unlist use-ability-list">
      {#each context.tools as tool (tool.key)}
        {@const modTotal = getModifierData(tool.total)}

        <li data-reference-tooltip={references[tool.key]}>
          <ProficiencyCycle
            actor={context.actor}
            aria-label={localize(tool.hover)}
            data-tooltip={tool.hover}
            disabled={!context.unlocked}
            path="system.tools.{tool.key}.value"
            type="tool"
            value={context.unlocked ? (tool.source?.value ?? 0) : tool.value}
          />
          {#if context.unlocked}
            <SelectQuadrone
              document={context.actor}
              field="system.tools.{tool.key}.ability"
              value={tool.baseAbility}
              class="skill-ability"
            >
              <SelectOptions
                data={context.config.abilities}
                labelProp="abbreviation"
              />
            </SelectQuadrone>
          {:else}
            <span
              class="skill-ability font-label-medium color-text-gold-emphasis"
            >
              {tool.abbreviation}
            </span>
          {/if}
          <button
            type="button"
            class="button button-borderless use-ability-roll-button"
            onclick={(event) =>
              context.actor.rollToolCheck({ tool: tool.key, event })}
            data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TOOL_ROLLER}
            data-key={tool.key}
            data-tidy-draggable
            data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_KEYED_FAVORITE}
            disabled={!context.owner}
          >
            {tool.label}
          </button>
          <span class="modifier">
            <span class="font-label-medium color-text-lightest">
              {modTotal.sign}
            </span>
            <span class="font-data-medium">
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

    <div class="tools-empty">
      {localize('TIDY5E.EmptyTools')}
    </div>
  {/if}
</FiligreeCard>
