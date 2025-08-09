import type { MouseEventHandler } from 'svelte/elements';

type SkipSvelteOnClickArgs = {
  handler?: MouseEventHandler<HTMLElement>;
};

export function skipSvelte_onclick(
  node: HTMLElement,
  args: SkipSvelteOnClickArgs
) {
  if (!args.handler) {
    return;
  }

  $effect(() => {
    const controller = new AbortController();

    node.addEventListener(
      'click',
      (event) => {
        args.handler?.(
          event as any as MouseEvent & {
            currentTarget: EventTarget & HTMLElement;
          }
        );
      },
      {
        signal: controller.signal,
      }
    );

    return () => {
      controller.abort();
    };
  });
}
