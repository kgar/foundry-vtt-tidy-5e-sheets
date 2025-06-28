import type { VehicleSheetQuadroneContext } from 'src/types/types';
import { ActorSheetQuadroneRuntime } from '../ActorSheetQuadroneRuntime.svelte';

// TODO: Make the magic! ✨
export const VehicleSheetQuadroneRuntime =
  new ActorSheetQuadroneRuntime<VehicleSheetQuadroneContext>([], []);
