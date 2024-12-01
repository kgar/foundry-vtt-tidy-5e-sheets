<script lang="ts">
  import { settingStore } from 'src/settings/settings';

  interface Props {
    tabs: string[];
    selected: string;
    [key: string]: any;
  }

  let { tabs, selected = $bindable(), ...rest }: Props = $props();
</script>

<div class="underlined-tab-strip flex-row no-gap {rest.class ?? ''}">
  {#each tabs as tab (tab)}
    <button
      type="button"
      class="underlined-tab"
      class:active={selected === tab}
      onclick={() => (selected = tab)}
      tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
    >
      {tab}
    </button>
  {/each}
</div>
