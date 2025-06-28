import type { VehicleSheetQuadroneContext } from 'src/types/types';
import { ActorSheetQuadroneRuntime } from '../ActorSheetQuadroneRuntime.svelte';

// TODO: Make the magic! ✨
const singleton = new ActorSheetQuadroneRuntime<VehicleSheetQuadroneContext>([], []);

export default singleton;
