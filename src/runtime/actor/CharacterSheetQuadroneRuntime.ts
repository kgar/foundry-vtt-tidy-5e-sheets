import type { CharacterSheetQuadroneContext } from 'src/types/types';
import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';
import type { RegisteredTab } from '../types';

const defaultCharacterQuadroneTabs: RegisteredTab<CharacterSheetQuadroneContext>[] =
  [];

const singleton = new ActorSheetRuntime<CharacterSheetQuadroneContext>(
  defaultCharacterQuadroneTabs
);

export default singleton;
