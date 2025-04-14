// TODO: Make the magic! ✨

import type { GroupSheetQuadroneContext } from 'src/types/types';
import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';
import type { RegisteredTab } from '../types';

const defaultGroupQuadroneTabs: RegisteredTab<GroupSheetQuadroneContext>[] = [];

const singleton = new ActorSheetRuntime<GroupSheetQuadroneContext>(
  defaultGroupQuadroneTabs
);

export default singleton;
