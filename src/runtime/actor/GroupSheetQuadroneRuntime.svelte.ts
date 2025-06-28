// TODO: Make the magic! ✨

import type { GroupSheetQuadroneContext } from 'src/types/types';
import { ActorSheetQuadroneRuntime } from '../ActorSheetQuadroneRuntime.svelte';

const singleton = new ActorSheetQuadroneRuntime<GroupSheetQuadroneContext>([], []);

export default singleton;
