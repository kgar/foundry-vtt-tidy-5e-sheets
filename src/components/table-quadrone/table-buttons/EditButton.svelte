<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    disabled?: boolean;
    doc: any;
  }

  let { doc, disabled }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<a
  class="tidy-table-button"
  title={localize('DND5E.ItemEdit')}
  onclick={() => !disabled && doc.sheet.render({ force: true })}
>
  <i class="fas fa-edit fa-fw"></i>
</a>
