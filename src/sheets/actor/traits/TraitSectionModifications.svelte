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
