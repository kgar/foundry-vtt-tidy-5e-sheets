<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { submitText } from 'src/sheets/form';
  import type { ActorSheetContext } from 'src/types/types';

  export let context: ActorSheetContext;

  const localize = FoundryAdapter.localize;
</script>

<ul class="resources">
  {#each context.resources as res}
    <li class="resource">
      <header class="resource-header">
        <span class="resource-options">
          <i class="fas fa-cog" />
        </span>
        <div class="resource-rest">
          <h4>{localize('T5EK.RestoreOnRest')}</h4>
          <input
            id="{context.appId}-{res.name}.sr"
            type="checkbox"
            checked={res.sr}
            on:change|stopPropagation|preventDefault={(event) =>
              context.actor.update({
                [`system.resources.${res.name}.sr`]:
                  event.currentTarget.checked,
              })}
          />
          <label
            for="{context.appId}-{res.name}.sr"
            class="checkbox"
            title={localize('TIDY5E.RestS')}
          >
            {localize('DND5E.RestS')}
          </label>
          <input
            id="{context.appId}-{res.name}.lr"
            type="checkbox"
            checked={res.lr}
            on:change|stopPropagation|preventDefault={(event) =>
              context.actor.update({
                [`system.resources.${res.name}.lr`]:
                  event.currentTarget.checked,
              })}
          />
          <label
            for="{context.appId}-{res.name}.lr"
            class="checkbox"
            title={localize('TIDY5E.RestL')}
          >
            {localize('DND5E.RestL')}
          </label>
        </div>
      </header>
      <h4 class="resource-name">
        <input
          type="text"
          value={res.label}
          placeholder={res.placeholder}
          on:change={(e) =>
            submitText(e, context.actor, `system.resources.${res.name}.label`)}
        />
      </h4>
      <div class="resource-value multiple">
        <input
          class="resource-value"
          type="text"
          value={res.value ?? null}
          placeholder="0"
          data-dtype="Number"
          maxlength="3"
          on:change={(e) =>
            submitText(e, context.actor, `system.resources.${res.name}.value`)}
        />
        <span class="sep"> / </span>
        <input
          class="resource-max"
          type="text"
          value={res.max ?? null}
          placeholder="0"
          data-dtype="Number"
          maxlength="3"
          on:change={(e) =>
            submitText(e, context.actor, `system.resources.${res.name}.max`)}
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
        input {
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
        input {
          font-size: 1.375rem;
          max-width: 3.5ch;
          height: 1.375rem;
          padding-top: 0.125rem;
        }

        span.sep {
          font-size: 1.3125rem;
          opacity: 0.5;
        }

        .resource-value {
          text-align: right;
        }

        .resource-max {
          text-align: left;
        }
      }
    }
  }
</style>
