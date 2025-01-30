<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { AttributePinContext } from 'src/types/types';
  import { coalesce } from 'src/utils/formatting';

  interface Props {
    ctx: AttributePinContext;
  }

  let { ctx }: Props = $props();

  let { usesDocument, valueProp, spentProp, maxProp, value, max } = $derived.by(
    () => {
      if (ctx.type === 'item') {
        // TODO: Order of precedence: Item limited uses, else primary Activity
        
        // If 'limited-uses' and item has limited uses, use item
        // If 'limited-uses' and item doesn't have limited uses, and activity has limited uses, use that
        // If 'quantity', use that
        // Else, edit icon

        return {
          usesDocument: ctx.item,
          value: ctx.item.system.uses.max - ctx.item.system.uses.spent,
          max: ctx.item.system.uses.max,
          valueProp: 'system.uses.value',
          spentProp: 'system.uses.spent',
          maxProp: 'system.uses.max',
        };
      } else {
        return {
          usesDocument: ctx.activity,
          value: ctx.activity.system.uses.max - ctx.activity.uses.spent,
          max: ctx.activity.system.uses.max,
          valueProp: 'uses.value',
          spentProp: 'uses.spent',
          maxProp: 'uses.max',
        };
      }
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

{#if ctx.type === 'item'}
  {@const item = ctx.item}
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
            placeholder="0"
            selectOnFocus={true}
          />
        {:else}
          <div class="attribute-pin-name truncate">{item.name}</div>
        {/if}
      </div>
      <div class="attribute-counter">
        <TextInput
          document={usesDocument}
          field={spentProp}
          value={value.toString()}
          onSaveChange={(ev) => saveValueChange(ev)}
          placeholder="0"
          selectOnFocus={true}
        />
        /

        <span>{coalesce(max?.toString(), '0')}</span>
      </div>
    </div>
  </div>
{/if}
