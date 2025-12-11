<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { type Actor5e } from 'src/types/types';

  interface Props {
    dataset: any;
    actor: Actor5e;
    create?: (() => void) | undefined;
  }

  let { dataset, actor, create = defaultCreateFunction }: Props = $props();

  const localize = FoundryAdapter.localize;

  function defaultCreateFunction() {
    return FoundryAdapter.createItem(dataset, actor);
  }
</script>

<button
  type="button"
  class="item-list-footer-button"
  onclick={create}
  title={localize('DND5E.FeatureAdd')}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_CREATE_COMMAND}
>
  <i class="fas fa-plus-circle"></i>
  {localize('DND5E.Add')}
</button>
