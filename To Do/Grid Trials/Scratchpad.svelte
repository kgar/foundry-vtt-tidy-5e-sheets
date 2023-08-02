<script lang="ts">
    type Data = { column1: string; column2: string; column3: string };
    type Column<T> = {
      name: string;
      getCellContent(obj: T, rowIndex: number): string;
      order: number;
      baseWidth: string;
    };
    type Expandable = { expanded: boolean };
  
    const columns: Column<Data>[] = [
      {
        name: 'Column1',
        getCellContent(data: Data): string {
          return data.column1;
        },
        order: 1,
        baseWidth: '1fr',
      },
      {
        name: 'Column2',
        getCellContent(data: Data): string {
          return data.column2;
        },
        order: 3,
        baseWidth: '10rem',
      },
      {
        name: 'Column3',
        getCellContent(data: Data): string {
          return data.column3;
        },
        order: 2,
        baseWidth: '7.5rem',
      },
    ];
  
    const rows: (Data & Expandable)[] = [
      {
        column1: 'Hello',
        column2: 'world',
        column3: '!',
        expanded: false,
      },
      {
        column1: 'Hello2',
        column2: 'world2',
        column3: '!2',
        expanded: false,
      },
      {
        column1: 'Hello3',
        column2: 'world3',
        column3: '!3',
        expanded: false,
      },
    ];
  
    const sortedColumns = [...columns].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  
    $: gridTemplateColumns = sortedColumns
      .map((a) => a.baseWidth ?? '1fr')
      .join(' ');
  </script>
  
  <div class="data-grid">
    <div
      class="data-grid-header-row"
      style="grid-template-columns: {gridTemplateColumns};"
    >
      {#each sortedColumns as column}
        <div class="data-grid-header-column">{column.name}</div>
      {/each}
    </div>
    {#each rows as row, rowIndex}
      <div
        class="data-grid-row"
        style="grid-template-columns: {gridTemplateColumns};"
        on:click={(event) => (row.expanded = !row.expanded)}
      >
        {#each sortedColumns as column, i}
          <div class="data-grid-cell">{column.getCellContent(row, rowIndex)}</div>
        {/each}
      </div>
      <div class="extra-info" class:expanded={row.expanded}>
        <h2>WHAT UP EVERYBODY THIS IS THE EXTRA INFO</h2>
        <marquee>WHOOOOOOAAAAAAAA!</marquee>
      </div>
    {/each}
  </div>
  
  <style>
    .data-grid-header-row,
    .data-grid-row {
      display: grid;
      background: pink;
      border-radius: 0.3125rem;
      row-gap: 1.125rem;
    }
  
    .extra-info {
      display: none;
  
      &.expanded {
        display: unset;
      }
    }
  </style>
  