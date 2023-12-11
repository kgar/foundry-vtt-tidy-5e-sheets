import { isNil } from 'src/utils/data';
import type { RegisteredActorTab } from './types';

export function getOrderedEnabledSheetTabs<TContext>(
  config: RegisteredActorTab<TContext>[],
  context: TContext
) {
  return [...config].filter(
    (t) =>
      isNil(t.enabled) ||
      (typeof t.enabled === 'function' && t.enabled(context))
  );
}

export function getTabsAsConfigOptions<TContext>(
  tabs: RegisteredActorTab<TContext>[]
) {
  return tabs.reduce<Record<string, string>>((prev, curr) => {
    prev[curr.id] = curr.title;
    return prev;
  }, {});
}
