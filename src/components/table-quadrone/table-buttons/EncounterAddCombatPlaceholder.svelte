<script lang="ts">
  import { TidyFlags } from 'src/api';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    doc: any;
    disabled?: boolean;
    addPlaceholderFn?: Function;
    tooltip?: string;
  }

  let { 
    doc, 
    disabled,
    addPlaceholderFn = () => alert('TODO: Add a placeholder to the combat tracker.'),
    tooltip = FoundryAdapter.localize('TIDY5E.Encounter.AddPlaceholder.Label'),
  }: Props = $props();
</script>

<a
  class="tidy-table-button {disabled ?? 'disabled'}"
  aria-label={tooltip}
  data-tooltip
  onclick={() => !disabled && addPlaceholderFn()}
>
  <i class="fa-solid fa-circle-dashed"></i>
</a>
