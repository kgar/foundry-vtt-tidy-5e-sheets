<script lang="ts">
  import type { Item5e } from 'src/types/item.types';

  interface Props {
    item: Item5e;
  }

  let { item }: Props = $props();
</script>

Spell: {item.name}
