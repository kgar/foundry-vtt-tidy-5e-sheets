<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let tooltip = FoundryAdapter.localize('DND5E.ITEM.Property.Magical');
</script>

<span
  class={['tidy-table-button', 'color-text-gold']}
  aria-label={tooltip}
  data-tooltip
>
  <i class="fa-solid fa-sparkles fa-fw"></i>
</span>
