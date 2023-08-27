<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e, ItemChatData } from 'src/types/item';
    import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';

  export let item: Item5e;
  export let chatData: ItemChatData;

  const localize = FoundryAdapter.localize;
</script>

<div
  class="info-card {item.attunement?.cls ?? ''}"
  class:magic-item={item.system.properties?.mgc}
  class:equipped={item.system.equipped}
  data-item-id={item._id}
>
  <p class="info-card-name">{item.name}</p>
  <HorizontalLineSeparator borderColor='faint' cssClass="margin-to-edge" />
  {#if item.hasUses}
    <div class="info-card-amount">
      <span
        ><i class="fas fa-bolt" /><b>{localize('DND5E.Charges')}:</b>
        {item.system.uses.value}/{item.system.uses.max}</span
      >
    </div>
  {/if}
  <div class="description-wrap">
    <div class="info-card-description">
      {@html chatData.description.value}
    </div>
  </div>
  <article class="mod-roll-buttons" />
</div>
