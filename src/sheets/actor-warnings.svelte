<script lang="ts">
  export let warnings: any;
</script>

<ol class="warnings">
  {#each warnings as warning}
    <li class="notification {warning.type}">
      {#if warning.link}
        <a data-target={warning.link}>{warning.message}</a>
      {:else}
        {warning.message}
      {/if}
    </li>
  {/each}
</ol>

<style lang="scss">
  .warnings {
    list-style: none;
    padding: 0;
    margin: 0;

    .notification.warning {
      margin: 0;
      border-radius: 0;
      box-shadow: none;
    }
  }
</style>
