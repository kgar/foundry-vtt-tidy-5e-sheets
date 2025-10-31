/**
 * The data required to provide a custom actor trait on actor sheets.
 */

import type { ClassValue } from 'svelte/elements';

/** @category Configuration */
export interface CustomActorTrait {
  /** The primary title text to display for this trait. */
  title: string;

  /** Empty traits can be collapsed. Set to `true` to never hide this trait. Default: `false`. */
  alwaysShow?: boolean;

  /** Handler for when the configuration command is executed. This could be when a user clicks an edit/configuration button on the sheet. */
  openConfiguration?: (params: CustomTraitOpenConfigurationParams) => void;

  /** The tooltip to show when hovering over the trait configuration button. */
  openConfigurationTooltip?: string;

  /** An optional callback to determine if this trait should show for the target sheet. When this callback is excluded, it is considered enabled by default. When enabled returns `false`, the trait does not render to the sheet. */
  enabled?: (params: CustomTraitEnabledParams) => boolean;

  /** An optional class for an `<i>` element to render an icon. Currently cupports FontAwesome and RPG Awesome. */
  iconClass?: string;

  /**
   * Callback for providing pills to include with the custom trait section.
   * Parameters:
   *   - app - the sheet instance.
   *   - document - the relevant Foundry document.
   *   - context - the Tidy prepared context data. Use as your own risk.
   */

  pills?: (params: CustomTraitRenderParams) => CustomTraitEntry[];
  /**
   * Callback for providing custom HTML content, to render below any pills.
   *   - app - the sheet instance.
   *   - document - the relevant Foundry document.
   *   - context - the Tidy prepared context data. Use as your own risk.
   */
  content?: (params: CustomTraitRenderParams) => string;
}

export type CustomTraitRenderParams = {
  /** The sheet instance. */
  app: any;
  /** The sheet element. */
  element: HTMLElement;
  /** The Tidy prepared context data. Use as your own risk. */
  data: any;
};

export type CustomTraitOnClickParams = {
  /** The sheet instance. */
  app: any;
  /** The sheet element. */
  element: HTMLElement;
  /** The Tidy prepared context data. Use as your own risk. */
  context: any;
  /** The click event. */
  event: MouseEvent;
};

export type CustomTraitEntry = {
  /**
   * An optional handler for when the pill is clicked. If a function is provided, then the pill will render as an interactive HTML element such as an anchor or a button.
   * Parameters:
   *   - app - the sheet instance.
   *   - document - the relevant Foundry document.
   *   - context - the Tidy prepared context data. Use as your own risk.
   */
  onClick?: (params: CustomTraitOnClickParams) => void;
  /** 
    Custom HTML content, to appear to the right of any specified icons and before any other content.
    This content is specifically rendered as HTML, unlike the more specific building blocks.
   */
  content?: string;

  /* -------------------------------------------- */
  /*  Curated pill content                        */
  /* -------------------------------------------- */
  /* The below content is assembled with Tidy-specific markup and classes to form common pills. */

  /** Icons associated with the trait. */
  icons?: { icon: string; label: string }[];
  /** Text that describes the trait. */
  label: string;
  /** The number sign (+ or -) for a numeric trait. */
  sign?: string;
  /** A value associated with the trait. */
  value?: string;
  /** The localized units abbreviation. */
  units?: string;
  /** The units key for CONFIG.DND5E purposes. */
  unitsKey?: string;
  /**
   * Optional classes to apply to the resulting trait UI element. Any clsx value is permissible.
   *
   * @example ['your-classes', 'canBeListed', { ['in-a-variety']: true, ['of-ways']: false}]
   * @example 'your-classes canBeListed in-a-variety of-ways'
   *
   * @see {@link https://svelte.dev/docs/svelte/class}
   * @see {@link https://github.com/lukeed/clsx?tab=readme-ov-file#usage}
   */
  cssClass?: ClassValue;
  /** Any information that should appear in parentheses after the main trait context info. */
  parenthetical?: string;
};

/**
 * The parameters provided when the user has attempted to open configuration.
 */
/** @category Configuration */
export interface CustomTraitOpenConfigurationParams {
  /** The target sheet for the trait. */
  app: any;

  /** The sheet's HTML element. */
  element: HTMLElement;

  /** The actor sheet context data that is typically provided on render. */
  data: any;

  /** Any inciting event by the user. Usually, this will be a click or pointer event. */
  event: Event;
}

/** The parameters provided when determining if an actor trait should be enabled. */
/** @category Configuration */
export interface CustomTraitEnabledParams {
  /** The actor sheet. */
  app: any;
  /** The actor sheet HTML element. */
  element: HTMLElement;
  /** The actor sheet context data that is typically provided on render. */
  context: any;
}
