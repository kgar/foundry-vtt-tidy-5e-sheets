<script lang="ts">
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { getTidyFacilityIcon } from 'src/features/facility/facility';

  interface Props {
    /** The order key, e.g. "craft". Empty when no order is running. */
    orderKey: string;
    /** Display label. Already localized by the system's `preLocalize`. */
    label: string;
  }

  let { orderKey, label }: Props = $props();

  let icon = $derived(getTidyFacilityIcon(orderKey));
</script>

{#if orderKey}
  <span class="bastion-order truncate">
    {#if icon?.type === 'fa-icon-class'}
      <i class={icon.className}></i>
    {:else if icon?.type === 'dnd5e-icon'}
      <Dnd5eIcon src={icon.src}></Dnd5eIcon>
    {/if}
    <span class="truncate">{label}</span>
  </span>
{:else}
  <span class="color-text-lightest">&mdash;</span>
{/if}
