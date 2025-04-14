import type { CharacterSheetContext } from 'src/types/types';
import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';
import { defaultClassicCharacterColumns } from './default-character-classic-columns';

const singleton = new ActorSheetRuntime<CharacterSheetContext>(
  defaultClassicCharacterColumns
);

export default singleton;
