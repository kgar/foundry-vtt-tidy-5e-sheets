<script lang="ts">
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { WorldSettingsContext } from '../WorldSettings.types';
  import { CONSTANTS } from 'src/constants';

  const context = getContext<WorldSettingsContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<div class="settings-form">
  <CheckboxSetting
    bind:value={context.settings.showNpcRestInChat}
    name={'TIDY5E.Settings.ShowNPCRestInChat.name'}
    hint={'TIDY5E.Settings.ShowNPCRestInChat.hint'}
    id="showNpcRestInChat"
  />
</div>
