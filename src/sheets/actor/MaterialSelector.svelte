<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { settingStore } from 'src/settings/settings';
  import type { Item5e } from 'src/types/item';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let item: Item5e;

  let context = getContext<Readable<ActorSheetContext>>('context');

  type MaterialSelectionOption = {
    text: string;
    value: string | null;
    material: Item5e | null;
  };

  let materials: MaterialSelectionOption[];
  $: materials = [
    {
      text: '',
      value: null,
      material: null,
    },
    ...$context.actor.items
      .filter(
        (x: any) =>
          ['consumable', 'loot'].includes(x.type) && !x.system.activation,
      )
      .map((x: any) => ({
        text: `${x.name} (${x.system.quantity})`,
        value: x.id,
        material: x,
      })),
  ];

  function onMaterialChange(item: Item5e, materialId: string) {
    const material = item.actor?.items.find((i: any) => i.id === materialId);

    item.update({
      system: {
        consume: {
          amount: !material
            ? null
            : !!item.system.consume?.amount
              ? item.system.consume.amount
              : 1,
          target: !material ? '' : material.id,
          type: !material ? '' : material.system.consumableType,
        },
      },
    });
  }
</script>

<select
  on:click|stopPropagation
  on:change={(event) => onMaterialChange(item, event.currentTarget.value)}
  disabled={!$context.editable}
>
  {#each materials as material}
    <option
      value={material.value}
      selected={item.system.consume?.target === material.value}
      >{material.text}</option
    >
  {/each}
</select>
