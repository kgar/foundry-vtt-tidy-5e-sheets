<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import type { Tool } from 'src/types/actor';
  import type { ActorSheetContext } from 'src/types/types';
  import { createEventDispatcher, getContext } from 'svelte';
  import { quadInOut } from 'svelte/easing';
  import type { Readable } from 'svelte/store';
  import { slide } from 'svelte/transition';

  let store = getContext<Readable<ActorSheetContext>>('store');
  export let title: string;
  export let configureButtonTitle: string;
  export let iconCssClass: string | undefined = undefined;
  export let traitCssClass: string | undefined = '';
  export let tags: [key: string, value: string][] = [];
  export let tools: [key: string, value: Tool][] = [];
  export let traitsExpanded: boolean;

  const dispatcher = createEventDispatcher<{
    onConfigureClicked: MouseEvent;
  }>();

  $: show = traitsExpanded || tags.length > 0 || tools.length > 0;
</script>

{#if show}
  <div
    class="trait-form-group {traitCssClass ?? ''}"
    transition:slide|global={{ duration: 200, easing: quadInOut }}
  >
    <span class="trait-icon" aria-label={title} {title}>
      {#if iconCssClass !== undefined}
        <i class={iconCssClass} />
      {/if}
      <slot name="custom-icon" />
    </span>
    <div class="trait-label-and-list">
      {#if SettingsProvider.settings.traitLabelsEnabled.get()}
        <span class="trait-label">{title}</span>
      {/if}
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
              title={tool.hover}
              role="button"
              on:click|stopPropagation|preventDefault={(event) =>
                FoundryAdapter.cycleProficiency(
                  $store.actor,
                  key,
                  tool.value,
                  'tools'
                )}
              on:contextmenu|stopPropagation|preventDefault={(event) =>
                FoundryAdapter.cycleProficiency(
                  $store.actor,
                  key,
                  tool.value,
                  'tools',
                  true
                )}
            >
              {@html tool.icon}
            </a>
            <span
              class="rollable"
              role="button"
              tabindex="0"
              on:click={(event) => $store.actor.rollToolCheck(key, { event })}
            >
              {tool.label}
            </span>
            {#if traitsExpanded}
              <a
                class="tool-proficiency-editor rollable"
                title="DND5E.ToolConfigure"
                on:click|stopPropagation|preventDefault={() =>
                  new dnd5e.applications.actor.ProficiencyConfig($store.actor, {
                    property: 'tools',
                    key,
                  }).render(true)}
              >
                <i class="fas fa-cog" />
              </a>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
    {#if traitsExpanded}
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
    {/if}
  </div>
{/if}

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
        font-weight: 700;
        color: var(--t5e-secondary-color);
      }

      .trait-list {
        display: flex;
        flex-wrap: wrap;
        column-gap: 0.25rem;

        &:first-child {
          padding-top: 0.125rem;
        }

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
