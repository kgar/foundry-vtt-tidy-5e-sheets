<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import { Tidy5eContainerSheetHightouch } from '../Tidy5eContainerSheetHightouch';
  import { CONSTANTS } from 'src/constants';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<Tidy5eContainerSheetHightouch>>(
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

  $: rarityColorVariable = `--t5e-color-Rarity-${$context.system.rarity?.slugify() ?? ''}`;

  const localize = FoundryAdapter.localize;
</script>

<aside
  class="sidebar"
  style="
    --t5e-item-rarity-color: var({rarityColorVariable}); 
    --filigree-border-color: var({rarityColorVariable})"
>
  <!-- TODO: Carve out shared component for new item portrait and extract appropriate styles. -->
  <!-- It feels like this image + filigree setup is hanging on by a thread. -->
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div
      style="--img-size: 6.5rem; position: relative; --filigree-background-color: none; max-width: 6.5rem; display: flex; align-items: center; justify-content: center; margin-inline: auto;"
    >
      <img
        style="width: var(--img-size); height: var(--img-size); border-radius: 1.25rem; object-fit: cover;"
        src={$context.item.img}
        alt={$context.name}
      />
      <div style="position: absolute; inset: 0; pointer-events: none;">
        <filigree-box>
          <div style="width: 100%; height: 100%;"></div>
        </filigree-box>
      </div>
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
<main class="item-content"></main>
