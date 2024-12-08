<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    ActorSheetContextV1,
    DamageModificationContextEntry,
  } from 'src/types/types';

  interface Props {
    modifications: DamageModificationContextEntry[];
  }

  let { modifications }: Props = $props();

  let context = $derived(getSheetContext<ActorSheetContextV1>());

  const localize = FoundryAdapter.localize;
</script>

<ul class="damage-modifications">
  {#each modifications as modification}
    <li
      class="damage-modification {modification.consequence} flex-row extra-small-gap"
    >
      {#each modification.icons ?? [] as icon}
        {@const propertyLabel =
          context.config.itemProperties[icon]?.label ?? ''}
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
