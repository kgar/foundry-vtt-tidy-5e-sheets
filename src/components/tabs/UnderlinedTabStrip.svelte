<script lang="ts">
  import { settingStore } from 'src/settings/settings';

  export let tabs: string[];
  export let selected: string;
</script>

<div class="underlined-tab-strip flex-row no-gap {$$restProps.class ?? ''}">
  {#each tabs as tab (tab)}
    <button
      type="button"
      class="underlined-tab"
      class:active={selected === tab}
      on:click={() => (selected = tab)}
      tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
    >
      {tab}
    </button>
  {/each}
</div>
