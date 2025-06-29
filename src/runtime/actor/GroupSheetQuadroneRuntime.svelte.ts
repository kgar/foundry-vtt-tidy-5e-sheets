// TODO: Make the magic! ✨

import type { GroupSheetQuadroneContext } from 'src/types/types';
import { ActorSheetQuadroneRuntime } from '../ActorSheetQuadroneRuntime.svelte';

export const GroupSheetQuadroneRuntime =
  new ActorSheetQuadroneRuntime<GroupSheetQuadroneContext>([], []);
