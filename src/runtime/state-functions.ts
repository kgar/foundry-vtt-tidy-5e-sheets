import type { SheetTabState } from './types';

export function getOrderedEnabledSheetTabs<TContext>(
  config: SheetTabState<TContext>[],
  context: TContext
) {
  return [...config]
    .filter(
      (t) =>
        t.enabled === true ||
        (typeof t.enabled === 'function' && t.enabled(context))
    );
}

export function getTabsAsConfigOptions<TContext>(
  tabs: SheetTabState<TContext>[]
) {
  return tabs
    .reduce<Record<string, string>>((prev, curr) => {
      prev[curr.id] = curr.displayName;
      return prev;
    }, {});
}
