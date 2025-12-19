<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';

  let context = $derived(getVehicleSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let sectionsContainer: HTMLElement;
  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  $effect(() => {
    const observer = new ResizeObserver(([entry]) => onResize(entry));
    observer.observe(sectionsContainer);
    return () => {
      observer.disconnect();
    };
  });

  const noCrew = $derived(
    !context.crew.assigned.members.length &&
      !context.crew.unassigned.members.length,
  );
</script>

<!-- TODO: Static "Pins" for Crew and Passengers -->
<div class="tidy-table-container" bind:this={sectionsContainer}>
  {#if context.crew.unassigned.members.length || noCrew}
    {@const section = context.crew.unassigned}
    <TidyTable key="unassigned" data-key="crew">
      {#snippet header(expanded)}
        <TidyTableHeaderRow class="theme-dark">
          <TidyTableHeaderCell primary={true} class="header-label-cell">
            <h3>
              {localize(section.label)}
            </h3>
          </TidyTableHeaderCell>
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each context.crew.unassigned.members as member}
          <!-- Unassigned table -->

          <TidyTableRow>
            <img
              class="item-image"
              alt={member.actor.name}
              src={member.actor.img}
            />

            <TidyTableCell primary={true} class="item-label text-cell">
              <a
                class="item-name"
                role="button"
                data-keyboard-focus
                tabindex="0"
              >
                <span class="cell-text">
                  <span class="cell-name">{member.actor.name}</span>
                  <span class="cell-context">TODO: Subtitle</span>
                </span>
              </a>
            </TidyTableCell>
          </TidyTableRow>
        {/each}
        {#if noCrew}
          <!-- Unassigned Empty State -->
        {/if}
      {/snippet}
    </TidyTable>
  {/if}

  <!-- Assigned table -->
  {#if context.crew.assigned.members.length}
    {@const section = context.crew.assigned}
    <TidyTable key="assigned" data-key="crew">
      {#snippet header(expanded)}
        <TidyTableHeaderRow class="theme-dark">
          <TidyTableHeaderCell primary={true} class="header-label-cell">
            <h3>
              {localize(section.label)}
            </h3>
            <span class="table-header-count">{section.members.length}</span>
          </TidyTableHeaderCell>
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each section.members as member}
          <TidyTableRow>
            <img
              class="item-image"
              alt={member.actor.name}
              src={member.actor.img}
            />
            <TidyTableCell primary={true} class="item-label text-cell">
              <a
                class="item-name"
                role="button"
                data-keyboard-focus
                tabindex="0"
              >
                <span class="cell-text">
                  <span class="cell-name">{member.actor.name}</span>
                  <span class="cell-context">TODO: Subtitle</span>
                </span>
              </a>
            </TidyTableCell>
          </TidyTableRow>
        {/each}
      {/snippet}
    </TidyTable>
  {/if}

  <TidyTable key="passengers" data-key="passengers">
    {#snippet header(expanded)}
      <TidyTableHeaderRow class="theme-dark">
        <TidyTableHeaderCell primary={true} class="header-label-cell">
          <h3>
            {localize(context.passengers.label)}
          </h3>
          <span class="table-header-count"
            >{context.passengers.members.length}</span
          >
        </TidyTableHeaderCell>
      </TidyTableHeaderRow>
    {/snippet}
    {#snippet body()}
      {#each context.passengers.members as member}
        <TidyTableRow>
          <img
            class="item-image"
            alt={member.actor.name}
            src={member.actor.img}
          />
          <TidyTableCell primary={true} class="item-label text-cell">
            <a class="item-name" role="button" data-keyboard-focus tabindex="0">
              <span class="cell-text">
                <span class="cell-name">{member.actor.name}</span>
                <span class="cell-context">TODO: Subtitle</span>
              </span>
            </a>
          </TidyTableCell>
        </TidyTableRow>
      {/each}
    {/snippet}
  </TidyTable>

  <!-- TODO: Crew: Empty State UI -->
</div>

<!-- TODO: Use snippets like Group sheet which are accent-color-aware for hover states, etc. -->
