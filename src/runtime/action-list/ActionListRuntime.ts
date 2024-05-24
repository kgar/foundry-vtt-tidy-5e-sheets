export class ActionListRuntime {
  private static _activationTypeMappings: Record<string, string> = {};

  static addActivationTypeMappings(mappings: Record<string, string>) {
    ActionListRuntime._activationTypeMappings = foundry.utils.mergeObject(
      ActionListRuntime._activationTypeMappings,
      mappings
    );
  }

  static getActivationTypeMappings() {
    return { ...ActionListRuntime._activationTypeMappings };
  }
}
