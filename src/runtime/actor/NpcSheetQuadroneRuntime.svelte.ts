import type { NpcSheetQuadroneContext } from 'src/types/types';
import type { RegisteredTab } from '../types';
import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';

const defaultNpcQuadroneTabs: RegisteredTab<NpcSheetQuadroneContext>[] = [];

// TODO: Make the magic! ✨
const singleton = new ActorSheetRuntime<NpcSheetQuadroneContext>(
  defaultNpcQuadroneTabs
);

export default singleton;
