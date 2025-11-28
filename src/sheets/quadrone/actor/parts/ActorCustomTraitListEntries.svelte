<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetQuadroneContext } from 'src/types/types';
  import ActorTraitConfigurableListEntry from './ActorTraitConfigurableListEntry.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ComponentProps } from 'svelte';

  type Props = Pick<
    ComponentProps<typeof ActorTraitConfigurableListEntry>,
    'configButtonLocation'
  >;

  let { configButtonLocation }: Props = $props();

  let context = $derived(getSheetContext<ActorSheetQuadroneContext>());

  const localize = FoundryAdapter.localize;
</script>

{#each context.customActorTraits as trait}
  <ActorTraitConfigurableListEntry
    {configButtonLocation}
    label={localize(trait.title)}
    entries={trait.pills}
    onconfig={trait.openConfiguration
      ? (ev) =>
          trait.openConfiguration?.({
            app: context.document.sheet,
            data: context,
            element: context.document.sheet.element,
            event: ev,
          })
      : undefined}
    configurationTooltip={trait.openConfigurationTooltip}
    icon={trait.iconClass}
    isCustomTrait={true}
    alwaysShow={trait.alwaysShow}
    contentHtml={trait.content}
  />
{/each}
