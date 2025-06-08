<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    doc: any;
  }

  let { doc }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<a onclick={() => alert('todo')}>
  <i class="fa-solid fa-book spell-row-icon"></i>
</a>
