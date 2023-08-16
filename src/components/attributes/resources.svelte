<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import TextInput from '../form/TextInput.svelte';

  let store = getContext<Readable<ActorSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<ul class="resources">
  {#each $store.resources as res}
    <li class="resource">
      <header class="resource-header">
        <span class="resource-options">
          <i class="fas fa-cog" />
        </span>
        <div class="resource-rest">
          <h4>{localize('T5EK.RestoreOnRest')}</h4>
          <input
            id="{$store.appId}-{res.name}.sr"
            type="checkbox"
            checked={res.sr}
            on:change|stopPropagation|preventDefault={(event) =>
              $store.actor.update({
                [`system.resources.${res.name}.sr`]:
                  event.currentTarget.checked,
              })}
          />
          <label
            for="{$store.appId}-{res.name}.sr"
            class="checkbox"
            title={localize('T5EK.RestS')}
          >
            {localize('DND5E.RestS')}
          </label>
          <input
            id="{$store.appId}-{res.name}.lr"
            type="checkbox"
            checked={res.lr}
            on:change|stopPropagation|preventDefault={(event) =>
              $store.actor.update({
                [`system.resources.${res.name}.lr`]:
                  event.currentTarget.checked,
              })}
          />
          <label
            for="{$store.appId}-{res.name}.lr"
            class="checkbox"
            title={localize('T5EK.RestL')}
          >
            {localize('DND5E.RestL')}
          </label>
        </div>
      </header>
      <h4 class="resource-name">
        <TextInput
          document={$store.actor}
          field="system.resources.{res.name}.label"
          value={res.label}
          placeholder={res.placeholder}
          selectOnFocus={true}
        />
      </h4>
      <div class="resource-value multiple">
        <TextInput
          cssClass="resource-value"
          document={$store.actor}
          field="system.resources.{res.name}.value"
          value={res.value ?? null}
          placeholder="0"
          dtype="Number"
          allowDeltaChanges={true}
          maxlength={3}
          selectOnFocus={true}
        />
        <span class="sep"> / </span>
        <TextInput
          document={$store.actor}
          field="system.resources.{res.name}.max"
          cssClass="resource-max"
          value={res.max ?? null}
          placeholder="0"
          dtype="Number"
          allowDeltaChanges={true}
          maxlength={3}
          selectOnFocus={true}
        />
      </div>
    </li>
  {/each}
</ul>

<style lang="scss">
  .resources {
    border: 0.0625rem solid var(--t5e-faint-color);
    border-radius: 0.3125rem;
    display: flex;
    flex-wrap: wrap;

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

      .resource-header {
        position: absolute;
        bottom: 0;
        right: 0;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        z-index: 10;

        .resource-options {
          position: relative;
          right: 0.125rem;
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
          transition: background 0.3s ease;
          text-align: center;
          flex: 0 0 3.125rem;
          line-height: 1rem;

          &:hover {
            background: var(--t5e-light-color);
          }
        }

        input {
          display: none;
        }

        input:checked + label.checkbox {
          background: var(--t5e-tertiary-color);
          color: var(--t5e-background);
        }

        &:hover {
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

        &:hover ~ * {
          opacity: 0;
        }
      }

      .resource-name {
        :global(input) {
          font-family: var(--t5e-modesto);
          font-weight: 700;
          font-size: 1rem;
          text-align: center;
          height: 1.125rem;
        }
      }

      .resource-value {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 1.375rem;
        line-height: 1.5625rem;
        font-family: var(--t5e-modesto);
      }

      .attribute-name input[type='text'] {
        height: 1.25rem;
        margin: 0;
        line-height: 1.5rem;
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
  }
</style>
