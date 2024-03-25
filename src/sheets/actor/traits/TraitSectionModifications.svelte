<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ActorSheetContext,
    DamageModificationContextEntry,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let modifications: DamageModificationContextEntry[];

  let context = getContext<Readable<ActorSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<ul class="damage-modifications">
  {#each modifications as modification}
    <li
      class="damage-modification {modification.consequence} flex-row extra-small-gap"
    >
      <!-- 

            {{#each icons}}
            {{#with (lookup (lookup @root.config.itemProperties this) "label") as |label|}}
            <i class="{{ ../this }}" data-tooltip="{{ localize 'DND5E.DamagePhysicalBypassesShort' type=label }}"
                aria-label="{{ localize 'DND5E.DamagePhysicalBypassesShort' type=label }}"></i>
            {{/with}}
            {{/each}}
         -->

      {#each modification.icons ?? [] as icon}
        {@const propertyLabel =
          $context.config.itemProperties[icon]?.label ?? ''}
        <i
          class="damage-modification-icon {icon}"
          title={localize('DND5E.DamagePhysicalBypassesShort', {
            type: propertyLabel,
          })}
        ></i>
      {/each}
      {modification.label}
    </li>
  {/each}
</ul>

<style lang="scss">
  .damage-modifications {
    display: flex;
    flex-wrap: wrap;
    row-gap: 0.125rem;
    column-gap: 0.25rem;
    // text-transform: uppercase;
    // padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }

  :where(.damage-modification) {
    font-size: 0.75rem;
    border-radius: 4px;
    padding: 0 0.25rem;
    background: var(--t5e-faintest-color);
    border: 0.0625rem solid var(--t5e-tertiary-color);
  }

  :where(.damage-modification-icon) {
    font-family: var(--font-awesome);
    font-weight: bold;
    font-style: normal;

    &:where(.ada)::before {
      content: '\f132';
    }
    &:where(.mgc)::before {
      content: '\f72b';
    }
    &:where(.sil)::before {
      content: '\53';
    }
  }
</style>
