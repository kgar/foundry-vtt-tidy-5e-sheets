<script lang="ts">
  import RerenderAfterFormSubmission from 'src/components/shared/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SheetEditor from 'src/sheets/SheetEditor.svelte';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  function activateProseMirrorListeners(node: HTMLElement) {
    $store.activateFoundryJQueryListeners(node);
  }
</script>

<div class="item-description flexrow align-items-stretch small-gap">
  <div class="item-properties">
    {#if $store.isPhysical}
      <div class="form-group">
        <label for="{$store.appId}-{$store.id}-quantity"
          >{localize('DND5E.Quantity')}</label
        >
        <input
          id="{$store.appId}-{$store.id}-quantity"
          type="number"
          value={$store.system.quantity}
          step="1"
          on:change={(event) =>
            $store.item.update({
              'system.quantity': event.currentTarget.value,
            })}
        />
      </div>

      <div
        aria-hidden="true"
        role="presentation"
        class="horizontal-line-separator"
      />

      <div class="form-group">
        <label for="{$store.appId}-{$store.id}-weight"
          >{localize('DND5E.Weight')}</label
        >
        <input
          id="{$store.appId}-{$store.id}-weight"
          type="number"
          value={$store.system.weight}
          step="any"
          on:change={(event) =>
            $store.item.update({ 'system.weight': event.currentTarget.value })}
        />
      </div>

      <div
        aria-hidden="true"
        role="presentation"
        class="horizontal-line-separator"
      />

      <div class="form-group">
        <label for="{$store.appId}-{$store.id}-price"
          >{localize('DND5E.Price')}</label
        >
        <input
          id="{$store.appId}-{$store.id}-price"
          type="number"
          value={$store.system.price.value}
          step="any"
          on:change={(event) =>
            $store.item.update({
              'system.price.value': event.currentTarget.value,
            })}
        />
        <select name="system.price.denomination">
          {#each Object.values($store.config.currencies) as currency}
            <option value={currency.abbreviation}
              >{currency.abbreviation}</option
            >
          {/each}
        </select>
      </div>
    {/if}

    {#if $store.labels.toHit || $store.labels.derivedDamage}
      <h4 class="properties-header">
        {localize('DND5E.Attack')}/{localize('DND5E.Damage')}
      </h4>
      <ol class="properties-list">
        {#if $store.labels.save}
          <li>
            {$store.labels.save}
          </li>
        {/if}

        {#if $store.labels.toHit}
          <li>
            {$store.labels.toHit}
            {localize('DND5E.ToHit')}
          </li>
        {/if}

        {#each $store.labels.derivedDamage as label}
          <li>
            {$store.label}
          </li>
        {/each}
      </ol>
    {/if}

    {#if $store.itemProperties.length}
      <section>
        <h4 class="properties-header">{localize('DND5E.Properties')}</h4>
        <ol class="properties-list">
          {#each $store.itemProperties as prop}
            <li>{prop}</li>
          {/each}
        </ol>
      </section>
    {/if}
  </div>

  <div aria-hidden="true" role="presentation" class="vertical-line-separator" />

  <RerenderAfterFormSubmission>
    <article use:activateProseMirrorListeners>
      <SheetEditor
        content={$store.system.description.value}
        editable={$store.editable}
        target="system.description.value"
        headerDetailsText={localize('TIDY5E.ItemDetailsHeadline')}
      />
    </article>
  </RerenderAfterFormSubmission>
</div>

<style lang="scss">
  .item-properties {
    flex: 0 0 7.5rem;
  }
</style>
