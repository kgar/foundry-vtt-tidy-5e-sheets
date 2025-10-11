<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { TabConfigContextEntry } from '../tab-configuration.types';
  import { VisibilityLevels } from 'src/features/visibility-levels/VisibilityLevels';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    entry: TabConfigContextEntry;
  }

  let { entry = $bindable() }: Props = $props();

  let visibilityLevelOptions = VisibilityLevels.getOptions();

  let userIsGm = FoundryAdapter.userIsGm();
</script>

<fieldset>
  {#each entry.visibilityLevels as tab}
    {#if userIsGm || tab.visibilityLevel !== CONSTANTS.VISIBILITY_LEVEL_GM}
      {@const formControlId = `${tab.id}-visibility`}
      <div class="form-group">
        <label for={formControlId}>{tab.title}</label>
        <div class="form-fields">
          <select id={formControlId} bind:value={tab.visibilityLevel}>
            {#each visibilityLevelOptions as option (option.key)}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
      </div>
    {/if}
  {/each}
</fieldset>
