<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings.svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  interface Props {
    tools?: [key: string, value: any][];
  }

  let { tools = [] }: Props = $props();

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
        <button
          type="button"
          class="tool-proficiency-toggle inline-transparent-button"
          title={tool.hover}
          onclick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            FoundryAdapter.cycleProficiency(
              $context.actor,
              key,
              tool.value,
              'tools',
            );
          }}
          oncontextmenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            FoundryAdapter.cycleProficiency(
              $context.actor,
              key,
              tool.value,
              'tools',
              true,
            );
          }}
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
          onclick={(event) =>
            $context.actor.rollToolCheck({ tool: key, event })}
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
          onclick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            FoundryAdapter.renderSkillToolConfig($context.actor, 'tools', key);
          }}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
            .TOOL_CONFIGURATION_CONTROL}
          tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fas fa-cog"></i>
        </button>
      {/if}
    </li>
  {/each}
</ul>
