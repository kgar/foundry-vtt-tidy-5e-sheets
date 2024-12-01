<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ContainerSheetClassicContext,
    Item5e,
    ItemChatData,
  } from 'src/types/item.types';
  import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type {
    ActorSheetContextV1,
    CharacterSheetContext,
    VehicleSheetContext,
  } from 'src/types/types';
  import { coalesce } from 'src/utils/formatting';

  interface Props {
    item: Item5e;
    chatData: ItemChatData;
    children?: import('svelte').Snippet;
  }

  let { item, chatData, children }: Props = $props();

  let context =
    getContext<
      Readable<
        | CharacterSheetContext
        | ActorSheetContextV1
        | VehicleSheetContext
        | ContainerSheetClassicContext
      >
    >('context');

  let ctx = $derived($context.itemContext[item.id] ?? {});
  let concealDetails = $derived(FoundryAdapter.concealDetails(item));

  const localize = FoundryAdapter.localize;
</script>

<div
  class="info-card {item.attunement?.cls ?? ''}"
  class:magic-item={item.system.properties?.has('mgc')}
  class:equipped={item.system.equipped}
  data-item-id={item._id}
>
  <p class="info-card-name">
    {item.system.identified === false
      ? coalesce(
          item.system.unidentified.name,
          localize('DND5E.Unidentified.Title'),
        )
      : item.name}
  </p>
  {#if 'hasUses' in ctx && ctx.hasUses}
    <div class="info-card-amount">
      <span
        ><i class="fas fa-bolt"></i><b>{localize('DND5E.Charges')}:</b>
        {item.system.uses.value}/{item.system.uses.max}</span
      >
    </div>
    <HorizontalLineSeparator borderColor="faint" />
  {/if}
  <div class="description-wrap">
    <div class="info-card-description user-select-text">
      {@html chatData.description}
    </div>
  </div>

  {@render children?.()}
</div>
