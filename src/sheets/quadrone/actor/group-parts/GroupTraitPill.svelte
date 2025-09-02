<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  type Props = {
    class?: ClassValue;
    count?: number;
    label?: string;
    units?: string;
    value?: number;
  };

  let { class: cssClass, label, count, value, units }: Props = $props();
</script>

<li class={['pill pill-medium', cssClass]}>
  {#if label}
    <span class="label font-label-medium">{label}</span>
  {/if}
  {#if count && count > 1}
    <span>
      {count}
    </span>
  {/if}
  {#if value && units}
    <span>
      <span class="value font-data-medium">{value}</span><span
        class="units font-default-medium color-text-lighter">{units}</span
      >
    </span>
  {:else if value}
    <span class="value font-data-medium">{value}</span>
  {/if}
</li>
