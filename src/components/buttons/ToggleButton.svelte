<script lang="ts">
  export let checked = false;
  export let disabled = false;
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<label class="button toggle-button {$$restProps.class ?? ''}" class:disabled>
  <slot />
  <input type="checkbox" class="hidden toggle" {checked} on:change />
</label>
