export type FoundryDocument = {
  update(data?: any, context?: DocumentModificationContext): Promise<FoundryDocument>;
};

type DocumentModificationContext = {};
