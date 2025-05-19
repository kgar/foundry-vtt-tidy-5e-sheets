<script lang="ts">
  import type { ActorTraitContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    values: ActorTraitContext[];
    pillClass?: ClassValue;
  }

  let { values, pillClass }: Props = $props();
</script>

<ul class="pills">
  {#each values as value}
    <li class={['pill pill-medium', pillClass, value.cssClass]}>
      {#if value.icons}
        {#each value.icons as icon}
          <i class={icon.icon} data-tooltip={icon.label}></i>
        {/each}
      {/if}
      <span class="label font-label-medium">
        {value.label}
      </span>
      {#if value.sign || value.value || value.units}
        <span>
          {#if value.sign}<span class="sign font-label-medium">{value.sign}</span>{/if}{#if value.value}<span class="value font-data-medium">{value.value}</span>{/if}{#if value.units}<span class="units font-default-medium color-text-lighter">{value.units}</span>{/if}
        </span>
      {/if}
    </li>
  {/each}
</ul>
