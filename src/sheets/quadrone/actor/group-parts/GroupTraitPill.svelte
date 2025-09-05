<script lang="ts">
  import type { ClassValue, HTMLLiAttributes } from 'svelte/elements';

  type Props = {
    class?: ClassValue;
    count?: number;
    label?: string;
    units?: string;
    value?: number;
  } & HTMLLiAttributes;

  let {
    class: cssClass,
    label,
    count,
    value,
    units,
    ...liAttributes
  }: Props = $props();
</script>

<li class={['pill pill-medium', cssClass]} {...liAttributes}>
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
