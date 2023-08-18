<script lang="ts">
  import NumberInput from 'src/components/form/NumberInput.svelte';
  import Select from 'src/components/form/Select.svelte';
  import SelectOptions from 'src/components/form/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemDescription from './ItemDescription.svelte';
  import { SettingsProvider } from 'src/settings/settings';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import VerticalLineSeparator from 'src/components/layout/VerticalLineSeparator.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<div class="item-description flexrow align-items-stretch small-gap">
  <div class="item-properties">
    {#if $store.isPhysical}
      <div class="form-group">
        <label for="{$store.appId}-{$store.id}-quantity"
          >{localize('DND5E.Quantity')}</label
        >
        <NumberInput
          id="{$store.appId}-{$store.id}-quantity"
          value={$store.system.quantity}
          field="system.quantity"
          document={$store.item}
          step="1"
          readonly={!FoundryAdapter.userIsGm() &&
            SettingsProvider.settings.lockItemQuantity.get()}
        />
      </div>

      <HorizontalLineSeparator />

      <div class="form-group">
        <label for="{$store.appId}-{$store.id}-weight"
          >{localize('DND5E.Weight')}</label
        >
        <NumberInput
          id="{$store.appId}-{$store.id}-weight"
          value={$store.system.weight}
          step="any"
          field="system.weight"
          document={$store.item}
        />
      </div>

      <HorizontalLineSeparator />

      <div class="form-group">
        <label for="{$store.appId}-{$store.id}-price"
          >{localize('DND5E.Price')}</label
        >
        <NumberInput
          id="{$store.appId}-{$store.id}-price"
          value={$store.system.price.value}
          step="any"
          field="system.price.value"
          document={$store.item}
        />
        <Select
          value={$store.system.price.denomination}
          field="system.price.denomination"
          document={$store.item}
        >
          <SelectOptions
            data={$store.config.currencies}
            valueProp="abbreviation"
            labelProp="abbreviation"
          />
        </Select>
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

        {#each $store.labels.derivedDamage ?? [] as derivedDamage}
          {@const label = derivedDamage.label}
          <li>
            {label}
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

  <VerticalLineSeparator />

  <ItemDescription />
</div>

<style lang="scss">
  .item-properties {
    flex: 0 0 7.5rem;
  }
</style>
