<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let tools: [key: string, value: any][] = [];

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<ul
  class="trait-list tools"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TOOLS_LIST}
>
  {#each tools as [key, tool]}
    <li
      class="tool"
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TOOL_CONTAINER}
      data-key={key}
    >
      {#if $context.editable && !$context.lockSensitiveFields}
        {@const activeEffectApplied =
          ActiveEffectsHelper.isActiveEffectAppliedToField(
            $context.actor,
            `system.tools.${key}.value`,
          )}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          class="tool-proficiency-toggle inline-transparent-button"
          title={tool.hover}
          on:click|stopPropagation|preventDefault={(event) =>
            !activeEffectApplied &&
            FoundryAdapter.cycleProficiency(
              $context.actor,
              key,
              tool.value,
              'tools',
            )}
          on:contextmenu|stopPropagation|preventDefault={(event) =>
            !activeEffectApplied &&
            FoundryAdapter.cycleProficiency(
              $context.actor,
              key,
              tool.value,
              'tools',
              true,
            )}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TOOL_PROFICIENCY_TOGGLE}
          data-tooltip={activeEffectApplied
            ? localize('DND5E.ActiveEffectOverrideWarning')
            : null}
        >
          {@html tool.icon}
        </a>
      {:else}
        <span title={tool.hover} class="tool-proficiency-readonly"
          >{@html tool.icon}</span
        >
      {/if}

      {#if $context.editable}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          class="tool-check-roller inline-transparent-button rollable"
          on:click={(event) => $context.actor.rollToolCheck(key, { event })}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TOOL_ROLLER}
        >
          {tool.label}
        </a>
      {:else}
        <span class="tool-check-roller">
          {tool.label}
        </span>
      {/if}

      {#if $context.unlocked}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          class="tool-proficiency-editor inline-icon-button"
          title={localize('DND5E.ToolConfigure')}
          on:click|stopPropagation|preventDefault={() =>
            FoundryAdapter.renderProficiencyConfig(
              $context.actor,
              'tools',
              key,
            )}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
            .TOOL_CONFIGURATION_CONTROL}
        >
          <i class="fas fa-cog" />
        </a>
      {/if}
    </li>
  {/each}
</ul>
