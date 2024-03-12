<script lang="ts">
  import { settingStore } from 'src/settings/settings';
  import type { Item5e } from 'src/types/item.types';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let item: Item5e;

  let context = getContext<Readable<ActorSheetContext>>('context');

  let ammos: { text: string; value: string | null; ammo: Item5e | null }[];
  $: ammos = [
    {
      text: '',
      value: null,
      ammo: null,
    },
    ...$context.actor.items
      .filter(
        (item: any) =>
          item.system.type?.value === 'ammo' &&
          (!$settingStore.showEquippedAmmoOnly || item.system.equipped),
      )
      .map((item: any) => ({
        text: `${item.name} (${item.system.quantity})`,
        value: item.id,
        ammo: item,
      })),
  ];

  function onAmmoChange(item: Item5e, ammoId: string) {
    const ammo = item.actor?.items.find((i: any) => i.id === ammoId);

    item.update({
      system: {
        consume: {
          amount: !ammo
            ? null
            : !!item.system.consume?.amount
              ? item.system.consume.amount
              : 1,
          target: !ammo ? '' : ammo.id,
          type: !ammo ? '' : ammo.system.consumableType,
        },
      },
    });
  }
</script>

<select
  on:click|stopPropagation
  on:change={(event) => onAmmoChange(item, event.currentTarget.value)}
  disabled={!$context.editable}
>
  {#each ammos as ammo}
    <option
      value={ammo.value}
      selected={item.system.consume?.target === ammo.value}>{ammo.text}</option
    >
  {/each}
</select>

<style lang="scss"></style>
