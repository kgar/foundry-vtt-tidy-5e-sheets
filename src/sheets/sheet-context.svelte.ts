import { CONSTANTS } from 'src/constants';
import type { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
import type { TidyExtensibleDocumentSheetMixinInstance } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import type {
  ContainerSheetQuadroneContext,
  ItemSheetQuadroneContext,
} from 'src/types/item.types';
import type {
  CharacterSheetQuadroneContext,
  EncounterSheetQuadroneContext,
  GroupSheetQuadroneContext,
  NpcSheetQuadroneContext,
  VehicleSheetQuadroneContext,
} from 'src/types/types';
import { getContext } from 'svelte';

export function tryGetSheetContext<TContext = any>(): TContext | undefined {
  return getContext<CoarseReactivityProvider<TContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT
  )?.data;
}

export function getSheetContext<TContext = TidyExtensibleDocumentSheetMixinInstance>(): TContext {
  return getContext<CoarseReactivityProvider<TContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT
  ).data;
}

export function getCharacterSheetQuadroneContext(): CharacterSheetQuadroneContext {
  return getSheetContext<CharacterSheetQuadroneContext>();
}

export function getNpcSheetQuadroneContext(): NpcSheetQuadroneContext {
  return getSheetContext<NpcSheetQuadroneContext>();
}

export function getVehicleSheetQuadroneContext(): VehicleSheetQuadroneContext {
  return getSheetContext<VehicleSheetQuadroneContext>();
}

export function getGroupSheetQuadroneContext(): GroupSheetQuadroneContext {
  return getSheetContext<GroupSheetQuadroneContext>();
}

export function getEncounterSheetQuadroneContext(): EncounterSheetQuadroneContext {
  return getSheetContext<EncounterSheetQuadroneContext>();
}

export function getContainerSheetQuadroneContext(): ContainerSheetQuadroneContext {
  return getSheetContext<ContainerSheetQuadroneContext>();
}

export function getContainerOrItemSheetContextQuadrone():
  | ContainerSheetQuadroneContext
  | ItemSheetQuadroneContext {
  return getSheetContext<
    ContainerSheetQuadroneContext | ItemSheetQuadroneContext
  >();
}

export function getItemSheetContextQuadrone(): ItemSheetQuadroneContext {
  return getSheetContext<ItemSheetQuadroneContext>();
}
