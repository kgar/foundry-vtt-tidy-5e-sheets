import type { Tidy5eSheetsApi } from "src/api";

export abstract class ModuleIntegrationBase {
    abstract get moduleId(): string;
    abstract init(api: Tidy5eSheetsApi): void;
}

export abstract class SystemIntegrationBase {
    abstract init(api: Tidy5eSheetsApi): void;
}