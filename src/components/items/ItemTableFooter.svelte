<script lang="ts">
  import type { Actor5e } from 'src/foundry/foundry-adapter';
  import ItemCreateButton from '../shared/ItemCreateButton.svelte';

  export let dataset: Record<string, unknown>;
  export let actor: Actor5e;
</script>

<footer class="item-table-footer-row">
  <ItemCreateButton {dataset} {actor} />
</footer>
