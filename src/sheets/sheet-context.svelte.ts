import { CONSTANTS } from 'src/constants';
import type { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
import type { TidyExtensibleDocumentSheetMixinInstance } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import type {
  EncounterSheetClassicContext,
  GroupSheetClassicContext,
} from 'src/types/group.types';
import type {
  ContainerSheetClassicContext,
  ContainerSheetQuadroneContext,
  ItemSheetContext,
  ItemSheetQuadroneContext,
} from 'src/types/item.types';
import type {
  CharacterSheetContext,
  CharacterSheetQuadroneContext,
  EncounterSheetQuadroneContext,
  GroupSheetQuadroneContext,
  NpcSheetContext,
  NpcSheetQuadroneContext,
  VehicleSheetContext,
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

export function getCharacterSheetContext(): CharacterSheetContext {
  return getSheetContext<CharacterSheetContext>();
}

export function getCharacterSheetQuadroneContext(): CharacterSheetQuadroneContext {
  return getSheetContext<CharacterSheetQuadroneContext>();
}

export function getNpcSheetQuadroneContext(): NpcSheetQuadroneContext {
  return getSheetContext<NpcSheetQuadroneContext>();
}

export function getNpcSheetContext(): NpcSheetContext {
  return getSheetContext<NpcSheetContext>();
}

export function getVehicleSheetContext(): VehicleSheetContext {
  return getSheetContext<VehicleSheetContext>();
}

export function getVehicleSheetQuadroneContext(): VehicleSheetQuadroneContext {
  return getSheetContext<VehicleSheetQuadroneContext>();
}

export function getGroupSheetClassicContext(): GroupSheetClassicContext {
  return getSheetContext<GroupSheetClassicContext>();
}

export function getGroupSheetQuadroneContext(): GroupSheetQuadroneContext {
  return getSheetContext<GroupSheetQuadroneContext>();
}

export function getEncounterSheetClassicContext(): EncounterSheetClassicContext {
  return getSheetContext<EncounterSheetClassicContext>();
}

export function getEncounterSheetQuadroneContext(): EncounterSheetQuadroneContext {
  return getSheetContext<EncounterSheetQuadroneContext>();
}

export function getItemSheetContext(): ItemSheetContext {
  return getSheetContext<ItemSheetContext>();
}

export function getContainerSheetClassicContext(): ContainerSheetClassicContext {
  return getSheetContext<ContainerSheetClassicContext>();
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
