<script lang="ts">
  export let tabs: string[];
  export let selected: string;
</script>

<div class="underlined-tab-strip flex-row no-gap {$$restProps.class ?? ''}">
  {#each tabs as tab (tab)}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      class="underlined-tab"
      class:active={selected === tab}
      on:click={() => (selected = tab)}
    >
      {tab}
    </a>
  {/each}
</div>
