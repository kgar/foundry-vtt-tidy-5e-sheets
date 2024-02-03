/**
 * The data required to provide a custom actor trait on actor sheets.
 */
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
}

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
  /** The actor sheet context data that is typically provided on render. */
  context: any;
}
