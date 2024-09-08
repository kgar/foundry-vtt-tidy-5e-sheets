<script lang="ts">
  import { settingStore } from 'src/settings/settings';

  export let tabs: string[];
  export let selected: string;
</script>

<div class="underlined-tabs flex-row no-gap {$$restProps.class ?? ''}">
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

<style lang="scss">
  .underlined-tabs {
    .underlined-tab {
      width: auto;
      flex: 0 0 max-content;
      background: transparent;
      border: none;
      border-bottom: 0.1875rem solid transparent;
      color: var(--t5e-secondary-font-color);
      padding: 0.325rem 0.5rem;
      border-radius: 0;
      margin: 0;

      &:hover {
        border-bottom-color: var(--t5e-faint-color);
      }

      &.active {
        border-bottom-color: var(--t5e-tertiary-color);
        color: var(--t5e-primary-font-color);
        font-weight: 500;
      }
    }
  }
</style>
