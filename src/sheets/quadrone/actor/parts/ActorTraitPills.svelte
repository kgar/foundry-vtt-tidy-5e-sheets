<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    values: any[];
    icon?: any;
    label: any;
    pillClass?: ClassValue;
    onconfig?: () => void;
  }

  let { values, icon, label, onconfig, pillClass }: Props = $props();
</script>

<div class="pills-group">
  <div class="flexrow space-between">
    <h4>
      {#if icon}
        <i class={icon}></i>
      {/if}
      {label}
    </h4>
    {#if onconfig}
      <button
        type="button"
        class="button button-borderless icon-only config-button"
        onclick={(ev) => onconfig()}
      >
        <i class="fa-solid fa-cog"></i>
      </button>
    {/if}
  </div>
  <ul class="pills">
    {#each values as value}
      <li class={['pill', pillClass]}>
        {#each value.icons as icon}
          <i class={icon.icon} data-tooltip={icon.label}></i>
        {/each}
        <span class="label font-label-medium">
          {value.label}
        </span>
        {#if value.sign}
          <span class="sign color-text-lighter font-label-medium">
            {value.sign}
          </span>
        {/if}
        {#if value.value}
          <span class="value font-data-medium">
            {value.value}
          </span>
        {/if}
        {#if value.units}
          <span class="units color-text-lighter">
            {value.value}
          </span>
        {/if}
      </li>
    {/each}
  </ul>
</div>
