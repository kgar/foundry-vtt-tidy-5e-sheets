import { CONSTANTS } from 'src/constants';
import type { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
import type { GroupSheetClassicContext } from 'src/types/group.types';
import type {
  ContainerSheetClassicContext,
  ContainerSheetHightouchContext,
  ItemSheetContext,
} from 'src/types/item.types';
import type {
  CharacterSheetContext,
  NpcSheetContext,
  VehicleSheetContext,
} from 'src/types/types';
import { getContext } from 'svelte';

export function getSheetContext<TContext = any>(): TContext {
  return getContext<CoarseReactivityProvider<TContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT
  ).data;
}

export function getCharacterSheetContext(): CharacterSheetContext {
  return getSheetContext<CharacterSheetContext>();
}

export function getNpcSheetContext(): NpcSheetContext {
  return getSheetContext<NpcSheetContext>();
}

export function getVehicleSheetContext(): VehicleSheetContext {
  return getSheetContext<VehicleSheetContext>();
}

export function getGroupSheetClassicContext(): GroupSheetClassicContext {
  return getSheetContext<GroupSheetClassicContext>();
}

export function getItemSheetContext(): ItemSheetContext {
  return getSheetContext<ItemSheetContext>();
}

export function getContainerSheetClassicContext(): ContainerSheetClassicContext {
  return getSheetContext<ContainerSheetClassicContext>();
}

export function getContainerSheetHightouchContext(): ContainerSheetHightouchContext {
  return getSheetContext<ContainerSheetHightouchContext>();
}
