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

  let context = getSheetContext<ActorSheetQuadroneContext>();

  const localize = FoundryAdapter.localize;
</script>

{#each context.customActorTraits as trait, i}
  {@const pills =
    trait.pills?.({
      app: context.sheet,
      element: context.sheet.element,
      data: context,
    }) ?? []}
  {@const contentHtml = trait.content?.({
    app: context.sheet,
    element: context.sheet.element,
    data: context,
  })}
  <ActorTraitConfigurableListEntry
    {configButtonLocation}
    label={localize(trait.title)}
    entries={pills}
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
    {contentHtml}
  />
{/each}
