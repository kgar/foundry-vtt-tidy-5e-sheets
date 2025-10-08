<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    SheetTabConfigurationContext,
    SheetTabConfigurationQuadroneApplication,
  } from '../SheetTabConfigurationQuadroneApplication.svelte';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    app: SheetTabConfigurationQuadroneApplication;
    config: SheetTabConfigurationContext;
    title: string;
  }

  let { config, app, title }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<h2>{title}</h2>

<ul>
  {#each Object.entries(config.entry.allTabs) as tab}
    <li>
      <span>
        {tab[1].title}
      </span>
      <select bind:value={tab[1].visibilityLevel}>
        <option></option>
        <option value={CONSTANTS.DOCUMENT_OWNERSHIP_LEVEL_GM}>
          {localize('USER.GM')}
        </option>
        <option value={CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER}>
          {localize('OWNERSHIP.OWNER')}
        </option>
        <option value={CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER}>
          {localize('OWNERSHIP.OBSERVER')}
        </option>
        <option value={CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED}>
          {localize('OWNERSHIP.LIMITED')}
        </option>
      </select>
    </li>
  {/each}
</ul>
