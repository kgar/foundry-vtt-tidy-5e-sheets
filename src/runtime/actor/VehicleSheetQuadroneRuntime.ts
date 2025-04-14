import type { VehicleSheetQuadroneContext } from 'src/types/types';
import type { RegisteredTab } from '../types';
import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';

export const defaultVehicleQuadroneTabs: RegisteredTab<VehicleSheetQuadroneContext>[] =
  [];

// TODO: Make the magic! ✨
const singleton = new ActorSheetRuntime<VehicleSheetQuadroneContext>(
  defaultVehicleQuadroneTabs
);

export default singleton;
