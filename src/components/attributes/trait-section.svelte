<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Tool } from 'src/types/actor';
  import type { ActorSheetContext } from 'src/types/types';
  import { createEventDispatcher } from 'svelte';

  export let context: ActorSheetContext;
  export let title: string;
  export let configureButtonTitle: string;
  export let iconCssClass: string | undefined = undefined;
  export let traitCssClass: string | undefined = '';
  export let tags: [key: string, value: string][] = [];
  export let tools: [key: string, value: Tool][] = [];

  const dispatcher = createEventDispatcher<{
    onConfigureClicked: MouseEvent;
  }>();
</script>

<div class="trait-form-group {traitCssClass ?? ''}">
  <span class="trait-icon" aria-label={title} {title}>
    {#if iconCssClass !== undefined}
      <i class={iconCssClass} />
    {/if}
    <slot name="custom-icon" />
  </span>
  <div class="trait-label-and-list" {title}>
    <span class="trait-label">{title}</span>
    <ul
      class="trait-list"
      class:tools={tools.length}
      class:traits={tags.length}
    >
      {#each tags as [key, value]}
        <li class="tag {key}">{value}</li>
      {/each}
      {#each tools as [key, tool]}
        <li class="tool">
          <a
            class="tool-proficiency-toggle"
            data-tooltip={tool.hover}
            role="button"
            on:click|stopPropagation|preventDefault={(event) =>
              FoundryAdapter.cycleProficiency(
                context.actor,
                key,
                tool.value,
                'tools'
              )}
            on:contextmenu|stopPropagation|preventDefault={(event) =>
              FoundryAdapter.cycleProficiency(
                context.actor,
                key,
                tool.value,
                'tools',
                true
              )}
          >
            {@html tool.icon}
          </a>
          <h4
            class="rollable"
            role="button"
            tabindex="0"
            on:click={(event) => context.actor.rollToolCheck(key, { event })}
          >
            {tool.label}
          </h4>
          <a
            class="tool-proficiency-editor rollable"
            data-tooltip="DND5E.ToolConfigure"
            on:click|stopPropagation|preventDefault={() =>
              new dnd5e.applications.actor.ProficiencyConfig(context.actor, {
                property: 'tools',
                key,
              }).render(true)}
          >
            <i class="fas fa-cog" />
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <a
    class="trait-editor"
    title={configureButtonTitle}
    tabindex="0"
    role="button"
    on:click|stopPropagation|preventDefault={(event) =>
      dispatcher('onConfigureClicked', event)}
  >
    <i class="fas fa-pencil-alt" />
  </a>
</div>

<style lang="scss">
  .trait-form-group {
    display: flex;
    flex-direction: row;

    :global(i) {
      color: var(--t5e-tertiary-color);
      line-height: 1rem;
      vertical-align: middle;
    }

    .trait-icon,
    .trait-editor {
      flex: 0 0 1.375rem;
      font-size: 0.75rem;
      padding: 0.125rem 0 0 0;
      text-align: center;
    }

    .trait-editor:hover i,
    .tool-proficiency-editor:hover i,
    .tool-proficiency-toggle:hover :global(i) {
      color: var(--t5e-secondary-color);
      text-shadow: none;
    }

    .trait-label-and-list {
      flex: 1;

      .trait-label {
        font-size: 0.75rem;
        line-height: 0.875rem;
        font-weight: 700;
        color: var(--t5e-secondary-color);
      }

      .trait-list {
        line-height: 0.875rem;
        display: flex;
        flex-wrap: wrap;
        column-gap: 0.25rem;

        &.tools {
          gap: 0.125rem;
        }
      }

      .tag,
      .tool {
        font-size: 0.75rem;
      }

      .tag {
        &::after {
          content: ',';
        }

        &:last-child::after {
          content: none;
        }
      }

      .tool {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        background-color: var(--t5e-faintest-color);
        padding: 0 0.125rem;
        border-radius: 0.25rem;
        border: 0.0625rem solid var(--t5e-tertiary-color);
      }
    }
  }
</style>
