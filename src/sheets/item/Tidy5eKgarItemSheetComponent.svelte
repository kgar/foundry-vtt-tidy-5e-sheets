<script lang="ts">
  import type { ItemSheetContext } from 'src/types/item';
  import type { Readable } from 'svelte/store';

  export let store: Readable<ItemSheetContext>;

  $: context = $store;

  $: context, console.log(context);

  const id = Math.random();
</script>

<input
  type="text"
  value={context.item.name}
  on:change={(event) =>
    context.item.update({ name: event.currentTarget.value })}
/>

<blockquote>Sheet render id: {id}</blockquote>

<marquee>
  Behold {context.item.name}!
</marquee>
