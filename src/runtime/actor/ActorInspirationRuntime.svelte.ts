import type { BankedInspirationConfiguration } from "../types";

class ActorInspirationRuntimeImpl {
  private _bankedInspirationConfig: BankedInspirationConfiguration | undefined =
    $state();

  configureBankedInpsiration(config: BankedInspirationConfiguration) {
    // TODO: Validate / fallback?
    this._bankedInspirationConfig = config;
  }

  get bankedInspirationConfig() {
    return { ...this._bankedInspirationConfig };
  }
}

export const ActorInspirationRuntime = new ActorInspirationRuntimeImpl();