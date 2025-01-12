<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemImageBorder from '../item/parts/ItemImageBorder.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import PillSwitch from 'src/components/toggles/PillSwitch.svelte';
  import { getContainerSheetHightouchContext } from 'src/sheets/sheet-context.svelte';
  import { coalesce } from 'src/utils/formatting';
  import { untrack } from 'svelte';
  import TidyVisibilityObserver from 'src/components/utility/TidyVisibilityObserver.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import { RarityColors } from 'src/features/rarity-colors/RarityColors';

  let context = $derived(getContainerSheetHightouchContext());

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = $state(CONSTANTS.TAB_CONTAINER_CONTENTS);

  let identifiedText = $derived(
    context.system.identified
      ? localize('DND5E.Identified')
      : localize('DND5E.Unidentified.Title'),
  );

  let rarityColorVariable = $derived(
    RarityColors.getRarityColorVariableName(context.system.rarity),
  );

  let rarityText = $derived(
    RarityColors.getRarityText(context.system.rarity).titleCase(),
  );

  let denomination = $derived(
    CONFIG.DND5E.currencies[context.system.price.denomination],
  );

  let itemValueText = $derived(
    FoundryAdapter.formatNumber(context.system.price?.value),
  );

  let containerNameEl: HTMLElement | undefined = $state();
  let scrollMarkerEl: HTMLElement | undefined = $state();

  const headerOffset = $derived.by(() => {
    return untrack(() => {
      const headerHeight = coalesce(
        window.getComputedStyle(context.item.sheet.window.header).height,
        '36',
      );

      return `-${headerHeight}px`;
    });
  });

  let itemRarities = $derived(
    Object.entries(context.config.itemRarity).map(([key, value]) => {
      return {
        key,
        label: value,
        rarityColorVariableName: RarityColors.getRarityColorVariableName(key),
      };
    }),
  );
</script>

{#if !!containerNameEl}
  <TidyVisibilityObserver
    root={context.item.sheet.windowContent}
    trackWhenOffScreen={true}
    toObserve={[containerNameEl]}
    toAffect="self"
    rootMargin={headerOffset}
  />
{/if}

{#if !!scrollMarkerEl}
  <TidyVisibilityObserver
    root={context.item.sheet.windowContent}
    trackWhenOffScreen={true}
    toObserve={[scrollMarkerEl]}
    toAffect="self"
  />
{/if}

<div
  bind:this={scrollMarkerEl}
  class="container-header-start-scroll-marker"
  role="presentation"
></div>

<aside
  class="sidebar inverse"
  style="
    --t5e-item-rarity-color: var({rarityColorVariable}, var(--t5e-color-gold)); 
    --filigree-border-color: var({rarityColorVariable}, var(--t5e-color-gold))"
>
  <div class="item-image-rarity-container">
    <div class="item-image-container">
      <img class="item-image" src={context.item.img} alt={context.item.name} />
      <ItemImageBorder />
    </div>
    <div class="item-rarity-container">
      {#if context.unlocked}
        <Select
          id="rarity-{context.item.sheet.id}"
          document={context.item}
          field="system.rarity"
          class="item-rarity-selector capitalize"
          value={context.system.rarity}
          disabled={!context.editable}
          blankValue=""
        >
          <option value=""></option>
          {#each itemRarities as rarity (rarity.key)}
            <option
              value={rarity.key}
              style="--t5e-item-rarity-color: var({rarity.rarityColorVariableName}, var(--t5e-color-text-onInverse-default));"
            >
              {rarity.label}
            </option>
          {/each}
        </Select>
      {:else}
        <div class="item-rarity-text">{rarityText}</div>
      {/if}
    </div>
  </div>

  <ul class="pills stacked">
    <li>
      <PillSwitch
        checked={context.system.equipped}
        checkedIconClass="fas fa-hand-fist equip-icon fa-fw"
        uncheckedIconClass="far fa-hand fa-fw"
        onchange={(ev) =>
          context.item.update({
            'system.equipped': ev.currentTarget?.checked,
          })}
      >
        {localize('DND5E.Equipped')}
      </PillSwitch>
    </li>
    {#if FoundryAdapter.isAttunementApplicable(context.item)}
      <li>
        <PillSwitch
          checked={context.system.attuned}
          checkedIconClass="fas fa-sun equip-icon fa-fw"
          uncheckedIconClass="fas fa-sun equip-icon fa-fw"
          onchange={(ev) =>
            context.item.update({
              'system.attuned': ev.currentTarget?.checked,
            })}
        >
          {localize('DND5E.Attuned')}
        </PillSwitch>
      </li>
    {/if}
    {#if context.unlocked}
      <li>
        <PillSwitch
          checked={context.system.identified}
          checkedIconClass="fas fa-search fa-fw"
          uncheckedIconClass="fas fa-search fa-fw"
          onchange={(ev) =>
            context.item.update({
              'system.identified': ev.currentTarget?.checked,
            })}
        >
          {localize('DND5E.Identified')}
        </PillSwitch>
      </li>
    {:else}
      <li class="pill">
        <i class="fas fa-search"></i>
        <span class="label">
          {identifiedText}
        </span>
      </li>
    {/if}
  </ul>

  <div>
    <h4 class="currency-header">
      <span>{localize('DND5E.Currency')}</span>
      <a
        class="button icon-button currency-conversion"
        onclick={() =>
          context.owner &&
          new dnd5e.applications.CurrencyManager(context.document).render(true)}
        title={localize('DND5E.CurrencyManager.Title')}
      >
        <i class="fas fa-database"></i>
      </a>
    </h4>
    <div class="currencies">
      {#each context.currencies as currency (currency.key)}
        <label class="input-group">
          <i class="currency {currency.key}" aria-label={currency.key}></i>
          <TextInput
            document={context.document}
            field="system.currency.{currency.key}"
            id="{context.document.id}-system.currency.{currency.key}"
            value={currency.value}
            allowDeltaChanges={true}
            selectOnFocus={true}
            disabled={!context.editable || context.lockMoneyChanges}
            class="currency-item currency-{currency.key}"
            placeholder="0"
          />
          <span class="denomination {currency.key}" data-denom={currency.key}>
            {currency.abbr}
          </span>
        </label>
      {/each}
    </div>
  </div>

  <div>
    <h4>{localize('TIDY5E.Section.LabelPl')}</h4>
    <div class="pills flexcol">
      <div class="pill">
        <span class="lighter">
          {localize('DND5E.Inventory')}
        </span>
        <span>
          {localize('Default')}
        </span>
      </div>
      <div class="pill">
        <span class="lighter">
          {localize('TIDY5E.Actions.TabName')}
        </span>
        <span>
          {localize('Default')}
        </span>
      </div>
    </div>
  </div>

  {#if !context.concealDetails}
    {#if context.labels.toHit || context.labels.damages.length}
      <h4>
        {localize('DND5E.Attack')}/{localize('DND5E.Damage')}
      </h4>
      <ul class="pills" inert={context.concealDetails}>
        {#if context.labels.save}
          <li class="pill">
            {context.labels.save}
          </li>
        {/if}

        {#if context.labels.toHit}
          <li class="pill">
            {context.labels.toHit}
            {localize('DND5E.ToHit')}
          </li>
        {/if}

        {#each context.labels.damages ?? [] as damage}
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
  <div
    bind:this={containerNameEl}
    class="container-name-wrapper flex-row extra-small-gap align-items-center"
  >
    <!-- Name -->
    {#if context.unlocked}
      <TextInput
        field="name"
        document={context.item}
        value={context.item.name}
        class="document-name"
      />
    {:else}
      <div class="document-name">{context.item.name ?? ''}</div>
    {/if}
  </div>

  <!-- Header Summary -->
  <div class="item-header-summary">
    <!-- Value -->
    <div class="item-value">
      <!-- Currency Image -->
      <i
        class="currency {context.system?.price?.denomination ?? ''}"
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
        {context.system.weight?.value}
      </span>
    </div>

    <!-- <div class="item-header-summary-separator" role="presentation"></div> -->

    <!-- Quantity -->
    <!-- <div class="item-quantity">
      <span class="item-quantity-label text-lighter">
        {localize('DND5E.Quantity')}
      </span>
      <span class="item-quantity-value">
        {context.system.quantity}
      </span>
    </div> -->
  </div>

  <!-- Tab Strip -->
  <Tabs
    bind:selectedTabId
    tabs={context.tabs}
    cssClass="item-tabs"
    sheet={context.item.sheet}
  />

  <hr class="golden-fade" />

  <!-- Tab Contents -->
  <TabContents tabs={context.tabs} {selectedTabId} />
</main>
