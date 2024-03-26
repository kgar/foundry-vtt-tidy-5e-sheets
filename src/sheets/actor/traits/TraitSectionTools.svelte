<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import type { ActorSheetContext } from 'src/types/types';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let tools: [key: string, value: any][] = [];

  let context = getContext<Readable<ActorSheetContext>>('context');

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
        <button
          type="button"
          class="tool-proficiency-toggle inline-transparent-button"
          title={tool.hover}
          on:click|stopPropagation|preventDefault={(event) =>
            FoundryAdapter.cycleProficiency(
              $context.actor,
              key,
              tool.value,
              'tools',
            )}
          on:contextmenu|stopPropagation|preventDefault={(event) =>
            FoundryAdapter.cycleProficiency(
              $context.actor,
              key,
              tool.value,
              'tools',
              true,
            )}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TOOL_PROFICIENCY_TOGGLE}
          tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
          disabled={activeEffectApplied}
          data-tooltip={activeEffectApplied
            ? localize('DND5E.ActiveEffectOverrideWarning')
            : null}
        >
          {@html tool.icon}
        </button>
      {:else}
        <span title={tool.hover} class="tool-proficiency-readonly"
          >{@html tool.icon}</span
        >
      {/if}

      {#if $context.editable}
        <button
          type="button"
          class="tool-check-roller inline-transparent-button rollable"
          on:click={(event) => $context.actor.rollToolCheck(key, { event })}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TOOL_ROLLER}
          tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
        >
          {tool.label}
        </button>
      {:else}
        <span class="tool-check-roller">
          {tool.label}
        </span>
      {/if}

      {#if $context.unlocked}
        <button
          type="button"
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
          tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fas fa-cog" />
        </button>
      {/if}
    </li>
  {/each}
</ul>
