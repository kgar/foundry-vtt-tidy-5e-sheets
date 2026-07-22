import type { TidyComponentRegistry } from 'src/types/registry.types';
import GenericActionButton from 'src/components/table-quadrone/table-buttons/GenericActionButton.svelte';

export function getRegistryComponents(): TidyComponentRegistry {
  return {
    rowActions: {
      GenericActionButton: GenericActionButton,
    },
  };
}
