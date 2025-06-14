import type { ConfiguredColumnSpecification as ConfiguredColumnSpecification } from '../types';

export class ColumnsLoadout {
  constructor(columns: ConfiguredColumnSpecification[]) {
    this.columns = columns;
  }

  columns: ConfiguredColumnSpecification[] = $state([]);

  prioritized: ConfiguredColumnSpecification[] = $derived(
    this.columns.toSorted((a, b) => b.priority - a.priority)
  );

  ordered: ConfiguredColumnSpecification[] = $derived(
    this.columns.toSorted((a, b) => a.order - a.order)
  );
}
