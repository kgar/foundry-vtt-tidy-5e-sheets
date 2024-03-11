## Tidy 5e Sheets Integrations

As much as possible, Tidy 5e Sheets will provide tools to other modules that wish to integrate with the sheets. This is especially the case with sheet-augmenting modules.

However, there are more universal modules which are system agnostic and work across all of Foundry while applying minimal or no changes to sheets. For some universal modules, integration on the module's side is not possible or feasible, so Tidy 5e Sheets provides an integration layer that will leverage Tidy APIs and hooks to integrate from this module.

Integrations are meant to bridge the gap between universal, Foundry-wide modules and Tidy. Modules which augment sheets should instead seek to integrate from their code bases rather than look to be integrated here.

### Prerequisites

- The module is fairly system-agnostic
- The module has an accessible and stable API
- The module cannot otherwise work
- The module author is not willing to integrate from the target module