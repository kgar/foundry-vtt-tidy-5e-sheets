<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import { type Actor5e } from 'src/types/types';

  export let dataset: any;
  export let actor: Actor5e;
  export let create: (() => void) | undefined = defaultCreateFunction;

  const localize = FoundryAdapter.localize;

  function defaultCreateFunction() {
    return FoundryAdapter.createItem(dataset, actor);
  }
</script>

<button
  type="button"
  class="item-list-footer-button"
  on:click={create}
  title={localize('DND5E.FeatureAdd')}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_CREATE_COMMAND}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
>
  <i class="fas fa-plus-circle" />
  {localize('DND5E.Add')}
</button>
