import type { CustomHeaderControlsEntry } from 'src/api/api.types';

export class HeaderControlsRuntime {
  private static _headerControls: RegisteredCustomHeaderControlsEntry[] = [];

  static registerHeaderControls(
    controls: RegisteredCustomHeaderControlsEntry[]
  ) {
    this._headerControls.push(...controls);
  }

  static getHeaderControls(params: GetHeaderControlsParams) {
    return this._headerControls.filter(
      (c) =>
        (!c.documentTypes || c.documentTypes.includes(params.documentType)) &&
        (!c.supportedDocuments ||
          c.supportedDocuments.includes(params.documentName))
    );
  }
}

type SupportedDocument = 'Item' | 'Actor' | string;

/**
 * Not specifying supported documents or types means to skip filtering and include in all applications.
 */
type RegisteredCustomHeaderControlsEntry = CustomHeaderControlsEntry & {
  supportedDocuments?: SupportedDocument[];
  documentTypes?: string[];
};

type GetHeaderControlsParams = {
  documentName: string;
  documentType: string;
};
