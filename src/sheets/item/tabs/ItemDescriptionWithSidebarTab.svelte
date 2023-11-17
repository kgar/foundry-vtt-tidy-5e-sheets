<script lang="ts">
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import VerticalLineSeparator from 'src/components/layout/VerticalLineSeparator.svelte';
  import ItemDescriptions from '../parts/ItemDescriptions.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<div class="item-description flexrow align-items-stretch small-gap">
  <div class="item-properties">
    {#if $context.isPhysical}
      <div class="form-group">
        <label for="{$context.appId}-{$context.id}-quantity"
          >{localize('DND5E.Quantity')}</label
        >
        <NumberInput
          id="{$context.appId}-{$context.id}-quantity"
          value={$context.system.quantity}
          field="system.quantity"
          document={$context.item}
          step="1"
          disabled={!$context.owner || $context.lockItemQuantity}
        />
      </div>

      <HorizontalLineSeparator />

      <div class="form-group">
        <label for="{$context.appId}-{$context.id}-weight"
          >{localize('DND5E.Weight')}</label
        >
        <NumberInput
          id="{$context.appId}-{$context.id}-weight"
          value={$context.system.weight}
          step="any"
          field="system.weight"
          document={$context.item}
          disabled={!$context.owner}
        />
      </div>

      <HorizontalLineSeparator />

      <div class="form-group">
        <label for="{$context.appId}-{$context.id}-price"
          >{localize('DND5E.Price')}</label
        >
        <NumberInput
          id="{$context.appId}-{$context.id}-price"
          value={$context.system.price.value}
          step="any"
          field="system.price.value"
          document={$context.item}
          disabled={!$context.owner}
        />
        <Select
          value={$context.system.price.denomination}
          field="system.price.denomination"
          document={$context.item}
          disabled={!$context.owner}
        >
          <SelectOptions
            data={$context.config.currencies}
            valueProp="abbreviation"
            labelProp="abbreviation"
          />
        </Select>
      </div>
    {/if}

    {#if $context.labels.toHit || $context.labels.derivedDamage}
      <h4 class="properties-header">
        {localize('DND5E.Attack')}/{localize('DND5E.Damage')}
      </h4>
      <ol class="properties-list">
        {#if $context.labels.save}
          <li>
            {$context.labels.save}
          </li>
        {/if}

        {#if $context.labels.toHit}
          <li>
            {$context.labels.toHit}
            {localize('DND5E.ToHit')}
          </li>
        {/if}

        {#each $context.labels.derivedDamage ?? [] as derivedDamage}
          {@const label = derivedDamage.label}
          <li>
            {label}
          </li>
        {/each}
      </ol>
    {/if}

    {#if $context.itemProperties.length}
      <section>
        <h4 class="properties-header">{localize('DND5E.Properties')}</h4>
        <ol class="properties-list">
          {#each $context.itemProperties as prop}
            <li>{prop}</li>
          {/each}
        </ol>
      </section>
    {/if}
  </div>

  <VerticalLineSeparator />

  <ItemDescriptions />
</div>

<style lang="scss">
  .item-properties {
    flex: 0 0 7.5rem;
  }
</style>
