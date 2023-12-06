export abstract class ItemTabBase {
  abstract title: string;
  abstract tabId: string;
  abstract enabled?: (context: any) => boolean;
}
