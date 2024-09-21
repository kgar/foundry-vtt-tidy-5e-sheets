<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CharacterSheetContext, TidyResource } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import TextInput from '../../../components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import { settingStore } from 'src/settings/settings';

  export let resource: TidyResource;
  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.actor.id;

  const localize = FoundryAdapter.localize;

  let configActive = false;
  // TODO: Remove this mouseenter/mouseleave show/hide logic when Firefox supports `:has()`
  let viewingConfig = false;
</script>

<li
  class="resource {resource.cssClasses?.join(' ') ?? ''}"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.RESOURCE}
>
  <h4 class="resource-name" class:hidden={viewingConfig || configActive}>
    <TextInput
      document={$context.actor}
      field={resource.labelName}
      value={resource.label}
      placeholder={resource.placeholder}
      selectOnFocus={true}
      disabled={!$context.editable || $context.lockSensitiveFields}
    />
  </h4>
  <div
    class="resource-value multiple"
    class:hidden={viewingConfig || configActive}
  >
    <TextInput
      class="resource-value"
      document={$context.actor}
      field={resource.valueName}
      value={resource.value ?? null}
      placeholder="0"
      allowDeltaChanges={true}
      maxlength={3}
      selectOnFocus={true}
      disabled={!$context.editable}
    />
    <span class="sep"> / </span>
    <TextInput
      document={$context.actor}
      field={resource.maxName}
      class="resource-max"
      value={resource.max ?? null}
      placeholder="0"
      allowDeltaChanges={true}
      maxlength={3}
      selectOnFocus={true}
      disabled={!$context.editable || $context.lockSensitiveFields}
    />
  </div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <header
    class="resource-header"
    class:active={configActive}
    on:mouseenter={() => (viewingConfig = true)}
    on:mouseleave={() => (viewingConfig = false)}
  >
    <div class="resource-rest">
      <h4>{localize('TIDY5E.RestoreOnRest')}</h4>
      <input
        id="{appId}-{resource.name}-sr"
        type="checkbox"
        checked={resource.sr}
        on:change|stopPropagation|preventDefault={(event) =>
          $context.actor.update({
            [resource.srName]: event.currentTarget.checked,
          })}
        disabled={!$context.editable || $context.lockSensitiveFields}
        data-tidy-field={resource.srName}
      />
      <label
        for="{appId}-{resource.name}-sr"
        class="checkbox"
        title={localize('TIDY5E.ShortRest')}
      >
        {localize('DND5E.RestS')}
      </label>
      <input
        id="{appId}-{resource.name}-lr"
        type="checkbox"
        checked={resource.lr}
        on:change|stopPropagation|preventDefault={(event) =>
          $context.actor.update({
            [resource.lrName]: event.currentTarget.checked,
          })}
        disabled={!$context.editable || $context.lockSensitiveFields}
        data-tidy-field={resource.lrName}
      />
      <label
        for="{appId}-{resource.name}-lr"
        class="checkbox"
        title={localize('TIDY5E.LongRest')}
      >
        {localize('DND5E.RestL')}
      </label>
    </div>
    {#if $context.editable && !$context.lockSensitiveFields}
      <button
        type="button"
        class="inline-icon-button resource-options"
        class:active={configActive}
        on:click={() => {
          configActive = !configActive;
        }}
        tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
      >
        <i class="fas fa-cog" />
      </button>
    {/if}
  </header>
</li>

<style lang="scss">
  .resource {
    padding: 0.0625rem 0 0 0;
    height: 2.625rem;
    position: relative;
    border: none;
    border-radius: 0;
    border-left: 0.0625rem solid var(--t5e-faint-color);
    border-top: 0.0625rem solid var(--t5e-faint-color);
    flex: 1 0 33%;

    &:nth-child(3n + 1) {
      border-left: 0;
    }

    &:nth-child(-n + 3) {
      border-top: 0;
      margin-bottom: 0;
      padding-top: 0;
    }

    &:is(:has(> .resource-header:hover), :has(.resource-options:focus-visible))
      > :not(.resource-header) {
      display: none;
    }

    .resource-header {
      position: absolute;
      bottom: 0;
      right: 0;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      background-color: var(--t5e-sheet-background);
      overflow: hidden;

      .resource-options {
        position: relative;
        right: 0;
        padding: 0.125rem;
        bottom: 0;
        font-size: 0.75rem;
        color: var(--t5e-tertiary-color);
        transition: color 0.3s ease;
      }

      .resource-rest {
        display: none;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 0.3125rem;

        h4 {
          margin: 0.25rem 0 0 0;
          font-size: 0.75rem;
          line-height: 1;
          color: var(--t5e-secondary-color);
          flex: 0 0 100%;
          text-align: center;
        }
      }

      label.checkbox {
        border: 0.0625rem solid var(--t5e-light-color);
        padding: 0.1875rem;
        margin: 0 0.125rem;
        border-radius: 0.3125rem;
        font-size: 0.6875rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
        text-align: center;
        flex: 0 0 3.125rem;
        line-height: 1rem;

        &:hover {
          background-color: var(--t5e-light-color);
        }
      }

      input {
        display: none;
      }

      input:checked + label.checkbox {
        background: var(--t5e-tertiary-color);
        color: var(--t5e-background);
      }

      &.active,
      &:hover,
      // `:is()` is required to prevent this selector from crashing the whole style set if `:has()` is not supported
      &:is(:has(.resource-options:focus-visible)) {
        width: 100%;
        height: 100%;

        .resource-rest {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }

        .resource-options {
          color: var(--t5e-secondary-color);
        }
      }

      &.active {
        .resource-options {
          color: var(--t5e-primary-accent-color);
        }
      }
    }

    .resource-name {
      :global(input) {
        font-family: var(--t5e-title-font-family);
        font-weight: 700;
        font-size: 1rem;
        text-align: center;
        height: 1.125rem;
      }
    }

    .resource-value {
      justify-content: center;
      align-items: center;
      height: 1.375rem;
      line-height: 1.5625rem;
      font-family: var(--t5e-title-font-family);

      &:not(.hidden) {
        display: flex;
      }
    }

    .resource-value.multiple {
      :global(input) {
        font-size: 1.375rem;
        max-width: 3.5ch;
        height: 1.375rem;
        padding-top: 0.125rem;
      }

      span.sep {
        font-size: 1.3125rem;
        opacity: 0.5;
      }

      :global(.resource-value) {
        text-align: right;
      }

      :global(.resource-max) {
        text-align: left;
      }
    }
  }
</style>
