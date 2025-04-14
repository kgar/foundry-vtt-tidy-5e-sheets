import type { CharacterSheetQuadroneContext } from 'src/types/types';
import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';

const singleton = new ActorSheetRuntime<CharacterSheetQuadroneContext>(
  // TODO: Get to work and make those columns!
  []
);

export default singleton;
