<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Item5e } from 'src/types/item.types';

  interface Props {
    item: Item5e;
  }

  let { item }: Props = $props();

  let { usesDocument, valueProp, spentProp, maxProp, value, max } = $derived.by(
    () => {
      // TODO: Order of precedence: Item limited uses, else primary Activity
      return {
        usesDocument: item,
        value: item.system.uses.max - item.system.uses.spent,
        max: item.system.uses.max,
        valueProp: 'system.uses.value',
        spentProp: 'system.uses.spent',
        maxProp: 'system.uses.max',
      };
    },
  );

  function saveValueChange(
    ev: Event & { currentTarget: EventTarget & HTMLInputElement },
  ): boolean {
    FoundryAdapter.handleItemUsesChanged(
      ev,
      usesDocument,
      valueProp,
      spentProp,
      maxProp,
    );
    return false;
  }

  let context = $derived(getCharacterSheetContext());
</script>

<div class="attribute-pin">
  <div class="attribute-item-image">
    <ItemUseButton {item} />
  </div>
  <div class="attribute-pin-details">
    <div class="attribute-pin-name-container">
      {#if context.unlocked}
        <TextInput
          class="attribute-pin-name"
          document={item}
          field="name"
          value={item.name}
        />
      {:else}
        <div class="attribute-pin-name truncate">{item.name}</div>
      {/if}
    </div>
    <div class="attribute-counter">
      <TextInput
        document={usesDocument}
        field={spentProp}
        {value}
        onSaveChange={(ev) => saveValueChange(ev)}
      />
      /
      {#if context.unlocked}
        <TextInput document={usesDocument} field={maxProp} value={max} />
      {:else}
        <span>{max}</span>
      {/if}
    </div>
  </div>
</div>
