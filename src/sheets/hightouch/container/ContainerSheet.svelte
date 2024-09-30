<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import type { Readable } from 'svelte/store';
  import type { ContainerSheetHightouchContext } from 'src/types/item.types';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemImageBorder from '../shared/ItemImageBorder.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';

  let context = getContext<Readable<ContainerSheetHightouchContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: equippedText = $context.system.equipped
    ? localize('DND5E.Equipped')
    : localize('DND5E.Unequipped');

  $: identifiedText = $context.system.identified
    ? localize('DND5E.Identified')
    : localize('DND5E.Unidentified.Title');

  $: rarityText =
    //@ts-expect-error
    CONFIG.DND5E.itemRarity[$context.system.rarity]?.titleCase() ?? '';

  $: rarityColorVariable = `--t5e-color-rarity-${$context.system.rarity?.slugify() ?? ''}`;

  $: denomination =
    //@ts-expect-error
    CONFIG.DND5E.currencies[$context.system.price.denomination];

  $: itemValueText = FoundryAdapter.formatNumber($context.system.price?.value);

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = CONSTANTS.TAB_CONTAINER_CONTENTS;
</script>

<aside
  class="sidebar"
  style="
    --t5e-item-rarity-color: var({rarityColorVariable}, var(--t5e-color-gold)); 
    --filigree-border-color: var({rarityColorVariable}, var(--t5e-color-gold))"
>
  <div class="item-image-rarity-container">
    <div class="item-image-container">
      <img
        class="item-image"
        src={$context.item.img}
        alt={$context.item.name}
      />
      <ItemImageBorder />
    </div>
    <div class="item-rarity">
      <span>{rarityText}</span>
    </div>
  </div>

  <ul class="pills inverse stacked">
    {#if $context.unlocked}
      <li class="pill">TODO: Super Cool Switch Here</li>
    {:else}
      <li class="pill">
        <i class="fas fa-hand-fist equip-icon"></i>
        <span class="label">
          {equippedText}
        </span>
      </li>
      <li class="pill">
        <i class="fas fa-search"></i>
        <span class="label">
          {identifiedText}
        </span>
      </li>
    {/if}
  </ul>

  <div>
    <h4>{localize('TIDY5E.Section.LabelPl')}</h4>
    <ul class="pills inverse flexcol">
      <li class="pill">
        <span class="secondary">
          {localize('DND5E.Inventory')}
        </span>
      </li>
    </ul>
  </div>

  {#if !$context.concealDetails}
    {#if $context.labels.toHit || $context.labels.damages.length}
      <h4>
        {localize('DND5E.Attack')}/{localize('DND5E.Damage')}
      </h4>
      <ul class="pills inverse" inert={$context.concealDetails}>
        {#if $context.labels.save}
          <li class="pill">
            {$context.labels.save}
          </li>
        {/if}

        {#if $context.labels.toHit}
          <li class="pill">
            {$context.labels.toHit}
            {localize('DND5E.ToHit')}
          </li>
        {/if}

        {#each $context.labels.damages ?? [] as damage}
          {@const label = damage.label}
          <li class="pill">
            {label}
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</aside>
<main class="item-content">
  <div class="flex-row extra-small-gap align-items-center">
    <!-- Name -->
    {#if $context.unlocked}
      <TextInput
        field="name"
        document={$context.item}
        value={$context.item.name}
        class="document-name"
      />
    {:else}
      <div class="document-name">{$context.item.name ?? ''}</div>
    {/if}
  </div>

  <!-- Header Summary -->
  <div class="item-header-summary">
    <!-- Item Type -->
    <div class="item-type text-lighter">{$context.itemType ?? ''}</div>
    <div class="item-header-summary-separator" role="presentation"></div>
    <!-- Value -->
    <div class="item-value">
      <!-- Currency Image -->
      <i
        class="currency {$context.system?.price?.denomination ?? ''}"
        aria-label={denomination?.label ?? ''}
      ></i>
      <span class="item-value-number">
        <!-- Value Text -->
        <span class="text-default">
          {itemValueText}
        </span>
        <!-- Denom -->
        <span class="item-value-denomination text-lighter">
          {denomination?.abbreviation ?? ''}
        </span>
      </span>
    </div>

    <div class="item-header-summary-separator" role="presentation"></div>

    <!-- Weight -->
    <div class="item-weight">
      <i class="fas fa-weight-hanging item-weight-icon text-lightest"></i>
      <span class="item-weight-value">
        {$context.system.weight?.value}
      </span>
    </div>

    <div class="item-header-summary-separator" role="presentation"></div>

    <!-- Quantity -->
    <div class="item-quantity">
      <span class="item-quantity-label text-lighter">
        {localize('DND5E.Quantity')}
      </span>
      <span class="item-quantity-value">
        {$context.system.quantity}
      </span>
    </div>
  </div>

  <!-- Tab Strip -->

  <!-- Tab Contents -->
  <TabContents tabs={$context.tabs} {selectedTabId} />
</main>
