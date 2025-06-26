import type { VehicleSheetQuadroneContext } from 'src/types/types';
import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';

// TODO: Make the magic! ✨
const singleton = new ActorSheetRuntime<VehicleSheetQuadroneContext>([], []);

export default singleton;
