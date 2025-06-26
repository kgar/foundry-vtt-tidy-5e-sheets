// TODO: Make the magic! ✨

import type { GroupSheetQuadroneContext } from 'src/types/types';
import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';

const singleton = new ActorSheetRuntime<GroupSheetQuadroneContext>([], []);

export default singleton;
