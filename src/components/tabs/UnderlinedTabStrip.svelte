<script lang="ts">
  import { settings } from 'src/settings/settings.svelte';

  interface Props {
    tabs: string[];
    selected: string;
    [key: string]: any;
  }

  let { tabs, selected = $bindable(), ...rest }: Props = $props();
</script>

<div class="underlined-tab-strip flex-row no-gap {rest.class ?? ''}">
  {#each tabs as tab}
    <button
      type="button"
      class="underlined-tab"
      class:active={selected === tab}
      onclick={() => (selected = tab)}
    >
      {tab}
    </button>
  {/each}
</div>
