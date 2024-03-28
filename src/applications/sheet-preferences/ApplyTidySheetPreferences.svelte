<script lang="ts">
  import {
    ApplyTidySheetPreferencesApplication,
    type SheetPreferenceOption,
  } from './ApplyTidySheetPreferencesApplication';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let options: SheetPreferenceOption[];

  const localize = FoundryAdapter.localize;
</script>

<ul>
  {#each options as option (option.identifier)}
    <li>
      {option.identifier} - {option.label} - {option.selected}
    </li>
  {/each}
</ul>
<button
  on:click={() =>
    ApplyTidySheetPreferencesApplication.applyPreferences(options)}
  >{localize('TIDY5E.ButtonConfirm.Text')}</button
>
