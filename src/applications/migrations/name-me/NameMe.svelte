<script lang="ts">
  import TidySwitch from 'src/components/toggle/TidySwitch.svelte';
  import type { FigureItOut } from './FigureItOut';
  import ItemTable from 'src/components/item-list/v1/ItemTable.svelte';
  import ItemTableCell from 'src/components/item-list/v1/ItemTableCell.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from 'src/components/item-list/v1/ItemTableRow.svelte';

  export let figureItOut: FigureItOut<any>;

  function onMigrateClicked() {
    const selectedTargets = figureItOut.options
      .filter((t) => t.selected)
      .map((t) => t.target);
    figureItOut.onConfirm(selectedTargets);
  }

  $: selectedCount = figureItOut.options.filter((t) => t.selected).length;

  const switchWidth = '3.25rem';
</script>

<div class="name-me-container">
  <ItemTable location="bulk-selection" toggleable={false}>
    <svelte:fragment slot="header">
      <ItemTableHeaderRow>
        <ItemTableCell baseWidth={switchWidth}></ItemTableCell>
        <ItemTableCell primary={true}>DEBUG TEST</ItemTableCell>
      </ItemTableHeaderRow>
    </svelte:fragment>
    <svelte:fragment slot="body">
      {#each figureItOut.options as target (target.id)}
        <ItemTableRow>
          <ItemTableCell baseWidth={switchWidth}>
            <TidySwitch bind:value={target.selected} />
          </ItemTableCell>
          <ItemTableCell primary={true} cssClass="flex-row small-gap">
            {#each target.fields as field}
              {#if field.onClick}
                <button
                  type="button"
                  on:click={() => field.onClick?.(target.target)}
                  class="inline-transparent-button"
                  >{field.text}</button
                >
              {:else}
                <div>{field.text}</div>
              {/if}
            {/each}
          </ItemTableCell>
        </ItemTableRow>
      {/each}
    </svelte:fragment>
  </ItemTable>

  <div>Selected: {selectedCount}</div>
  <button on:click={() => onMigrateClicked()}>Confirm (DEBUG)</button>
</div>

<style lang="scss">
  .name-me-container {
    --tidy-switch-scale: 0.75;
  }
</style>
